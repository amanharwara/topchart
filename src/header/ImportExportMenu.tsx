import ImportIcon from "../icons/ImportIcon";
import IconButton from "../components/IconButton";
import {
  addNewChart,
  Chart,
  CommonChartOptionsParser,
  DiscriminatedChartOptionsParser,
  getSelectedChart,
  isMusicCollageChart,
  setSelectedChartId,
  useSelectedChart,
} from "../stores/charts";
import { Menu, MenuArrow, MenuItem, useMenuStore } from "@ariakit/react";
import { useCallback, useRef, useState } from "react";
import ExportIcon from "../icons/ExportIcon";
import { useToast } from "../components/Toast";
import { useStateRef } from "../utils/useStateRef";
import { saveAsFile } from "../utils/saveAsFile";
import { getImageFromDB, storeImageToDB } from "../stores/imageDB";
import { z } from "zod";
import { base64ToWebP, canUseWebP } from "../utils/webp";
import Modal from "../components/Modal";
import Toggle from "../components/Toggle";
import Button from "../components/Button";
import { blobToDataURL } from "../addCoverArt/blobToDataURL";

const getImagesFromChart = async (
  chart: Chart,
  shouldCompressImages: boolean
) => {
  const images: {
    [key in string]: string;
  } = {};
  if (isMusicCollageChart(chart)) {
    await Promise.all(
      chart.options.items.map(async (item) => {
        if (!item.image) return;

        const image = await getImageFromDB(item.image);

        if (!image) return;

        const isWebPImage = image.indexOf("data:image/webp") === 0;

        if (shouldCompressImages && !isWebPImage) {
          const convertedBlob = await base64ToWebP(image);
          const dataURL = await blobToDataURL(convertedBlob);
          images[item.image] = dataURL;
          return;
        }

        images[item.image] = image;
      })
    );
  }
  return images;
};

const useExportFunction = () => {
  const toasts = useToast();
  const toastsRef = useStateRef(toasts);

  return useCallback(
    async (shouldCompressImages: boolean) => {
      const selectedChart = getSelectedChart();
      setTimeout(() => {
        toastsRef.current.create({
          title: "Exporting chart",
          description: "Please wait...",
          type: "loading",
          placement: "bottom-end",
        });
      });
      try {
        if (!selectedChart) throw new Error("No chart selected");
        const images = await getImagesFromChart(
          selectedChart,
          shouldCompressImages
        );
        const chartJSON = JSON.stringify({
          ...selectedChart,
          id: undefined,
          images,
        });
        saveAsFile(
          chartJSON,
          `${selectedChart.title}.json`,
          "application/json"
        );
        setTimeout(() => {
          toastsRef.current.dismiss();
          toastsRef.current.create({
            title: "Exported chart",
            description: `Chart "${selectedChart.title}" exported successfully!`,
            type: "info",
            placement: "bottom-end",
          });
        });
      } catch (error) {
        console.error(error);
      }
    },
    [toastsRef]
  );
};

const ExportModal = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const selectedChart = useSelectedChart();
  const exportSelectedChart = useExportFunction();
  const [shouldCompressImages, setShouldCompressImages] = useState(
    () => canUseWebP
  );
  const exportButtonRef = useRef<HTMLButtonElement | null>(null);

  const onExport = () => {
    exportSelectedChart(shouldCompressImages);
    setOpen(false);
  };

  return (
    <Modal
      title={`Export chart "${selectedChart?.title}"`}
      isOpen={true}
      setOpen={setOpen}
      initialFocus={exportButtonRef}
    >
      <div className="px-2.5 py-3">
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-3 font-semibold">
            <Toggle
              value={shouldCompressImages}
              onChange={setShouldCompressImages}
              className="flex-shrink-0 max-h-5"
              aria-describedby="image-compress-description"
            />
            Compress images to reduce size?
          </label>
          <div id="image-compress-description" className="text-sm max-w-[40ch]">
            When enabled, images will be converted to WebP before exporting,
            which allows for much smaller sizes without a noticeable loss in
            quality.
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 dark:border-slate-600 px-2.5 py-2">
        <Button ref={exportButtonRef} onClick={onExport}>
          Export
        </Button>
      </div>
    </Modal>
  );
};

export const ImportExportMenu = () => {
  const [showExportModal, setShowExportModal] = useState(false);

  const anchorRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuStore = useMenuStore();

  const toasts = useToast();
  const toastsRef = useStateRef(toasts);

  const importChartFromFile = useCallback(
    async (file: File) => {
      const toastId = toasts.create({
        title: "Importing chart",
        description: "Please wait...",
        type: "loading",
        placement: "bottom-end",
      });
      try {
        const json = JSON.parse(await file.text());
        const chart = CommonChartOptionsParser.omit({ id: true })
          .and(DiscriminatedChartOptionsParser)
          .and(
            z.object({
              images: z.unknown(),
            })
          )
          .parse(json);
        const images = chart.images;
        delete chart["images"];
        const chartId = addNewChart(chart);
        setSelectedChartId(chartId);
        setTimeout(() => {
          toastsRef.current.dismiss(toastId);
          toastsRef.current.create({
            title: `Switched to "${chart.title}"`,
            description: `Chart "${chart.title}" imported successfully!`,
            type: "info",
            placement: "bottom-end",
          });
        });
        if (images && typeof images === "object") {
          const toastId = toastsRef.current.create({
            title: "Importing images...",
            type: "loading",
            placement: "bottom-end",
          });
          await Promise.all(
            Object.entries(images).map(async ([key, value]) => {
              await storeImageToDB({
                id: key,
                content: value,
              });
            })
          );
          setTimeout(() => {
            toastsRef.current.dismiss(toastId);
            toastsRef.current.create({
              title: "Imported all images from chart",
              type: "info",
              placement: "bottom-end",
            });
          });
        }
      } catch (e) {
        console.error(e);
        setTimeout(() => {
          toastsRef.current.dismiss(toastId);
          toastsRef.current.create({
            title: "Could not import chart",
            description: "There was an error while importing the chart...",
            type: "error",
            placement: "bottom-end",
          });
        });
      }
    },
    [toasts, toastsRef]
  );

  const exportSelectedChart = useExportFunction();

  return (
    <>
      <IconButton
        icon={ImportIcon}
        label="Import/Export"
        ref={anchorRef}
        onClick={menuStore.toggle}
      />
      <input
        type="file"
        accept="application/json"
        className="invisible absolute w-px h-px"
        ref={fileInputRef}
        onChange={() => {
          if (!fileInputRef.current || !fileInputRef.current.files) return;
          const file = fileInputRef.current.files[0];
          if (!file) return;
          importChartFromFile(file);
        }}
      />
      <Menu
        portal={true}
        store={menuStore}
        className="dark:bg-slate-600 dark:text-white bg-slate-100 py-1 rounded border border-gray-800 z-50"
        getAnchorRect={() => {
          const refRect = anchorRef.current?.getBoundingClientRect();

          return {
            x: refRect?.x,
            y: refRect?.y,
            width: refRect?.width,
            height: refRect?.height,
          };
        }}
        gutter={4}
      >
        <MenuArrow className="hidden" />
        <MenuItem
          className="flex items-center gap-3 py-1.5 px-5 cursor-pointer dark:hover:bg-slate-700 dark:focus:bg-slate-700 hover:bg-slate-300 focus:bg-slate-300"
          onClick={() => {
            if (!fileInputRef.current) return;
            fileInputRef.current.click();
          }}
        >
          <ImportIcon className="w-5 h-5" />
          Import chart
        </MenuItem>
        <MenuItem
          className="flex items-center gap-3 py-1.5 px-5 cursor-pointer dark:hover:bg-slate-700 dark:focus:bg-slate-700 hover:bg-slate-300 focus:bg-slate-300"
          onClick={() => {
            if (canUseWebP) {
              setShowExportModal(true);
            } else {
              exportSelectedChart(false);
            }
          }}
        >
          <ExportIcon className="w-5 h-5" />
          Export chart
        </MenuItem>
      </Menu>
      {showExportModal && <ExportModal setOpen={setShowExportModal} />}
    </>
  );
};
