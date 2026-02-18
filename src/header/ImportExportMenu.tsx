import ImportIcon from "../icons/ImportIcon";
import IconButton from "../components/IconButton";
import {
  addNewChart,
  Chart,
  ChartWithoutId,
  CommonChartOptionsParser,
  DiscriminatedChartOptionsParser,
  getSelectedChart,
  isMusicCollageChart,
  setSelectedChartId,
  useChartsList,
  useSelectedChart,
} from "../stores/charts";
import { useCallback, useRef, useState } from "react";
import ExportIcon from "../icons/ExportIcon";
import { toastQueue } from "../components/Toast";
import { saveBlobAsFile, saveDataAsFile } from "../utils/saveAsFile";
import { getImageFromDB, storeImageToDB } from "../stores/imageDB";
import { z } from "zod";
import { base64ToWebP, canUseWebP } from "../utils/webp";
import { Modal } from "../components/Modal";
import { Toggle } from "../components/Toggle";
import Button from "../components/Button";
import { blobToDataURL } from "../addCoverArt/blobToDataURL";
import { Checkbox, CheckboxGroup, MenuTrigger } from "react-aria-components";
import { Tooltip } from "../components/Tooltip";
import { Menu, MenuItem } from "../components/Menu";
import ErrorIcon from "../icons/ErrorIcon";
import { nanoid } from "nanoid";
import SuccessIcon from "../icons/SuccessIcon";

async function getImagesFromChart(chart: Chart, shouldCompressImages: boolean) {
  const images: Record<string, string> = {};
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
      }),
    );
  }
  return images;
}

async function getChartJSON(
  chart: Chart,
  shouldCompressImages: boolean,
): Promise<string> {
  const images = await getImagesFromChart(chart, shouldCompressImages);
  const chartJSON = JSON.stringify({
    ...chart,
    id: undefined,
    images,
  });
  return chartJSON;
}

async function exportSelectedChart(shouldCompressImages: boolean) {
  const selectedChart = getSelectedChart();
  const key = toastQueue.add({
    title: "Exporting chart",
    description: "Please wait...",
    type: "loading",
  });
  if (!selectedChart) {
    console.error("No chart selected to export");
    return;
  }
  try {
    const chartJSON = await getChartJSON(selectedChart, shouldCompressImages);
    saveDataAsFile(
      chartJSON,
      `${selectedChart.title}.json`,
      "application/json",
    );
    toastQueue.close(key);
    toastQueue.add({
      title: "Exported chart",
      description: `Chart "${selectedChart.title}" exported successfully!`,
      type: "info",
    });
  } catch (error) {
    console.error(error);
  }
}

async function exportMultipleCharts(
  charts: Chart[],
  shouldCompressImages: boolean,
): Promise<void> {
  const zip = await import("@zip.js/zip.js");
  const writer = new zip.ZipWriter(new zip.BlobWriter("application/zip"));

  await Promise.all(
    charts.map(async (chart) => {
      const chartJSON = await getChartJSON(chart, shouldCompressImages);
      const blob = new Blob([chartJSON], { type: "application/json" });
      const fileName = `${chart.id}.json`;
      await writer.add(fileName, new zip.BlobReader(blob));
    }),
  );

  const zipBlob = await writer.close();
  saveBlobAsFile(zipBlob, `Topchart - ${charts.length} charts.zip`);
}

type ParsedImages = { images: Record<string, string> };
type ParsedChart = ChartWithoutId & ParsedImages;

function parseChartFromText(text: string): ParsedChart {
  const json = JSON.parse(text);
  const chart = CommonChartOptionsParser.omit({ id: true })
    .and(DiscriminatedChartOptionsParser)
    .and(
      z.object({
        images: z.record(z.string()),
      }),
    )
    .parse(json);
  return chart;
}

async function importImagesToDB(images: Record<string, string>) {
  await Promise.all(
    Object.entries(images).map(async ([key, value]) => {
      await storeImageToDB({
        id: key,
        content: value,
      });
    }),
  );
}

async function importChartFromFile(file: File) {
  const toastId = toastQueue.add({
    title: "Importing chart",
    description: "Please wait...",
    type: "loading",
  });
  try {
    const chart = parseChartFromText(await file.text());
    const images = chart.images;
    const chartId = addNewChart(chart);
    setSelectedChartId(chartId);
    toastQueue.close(toastId);
    toastQueue.add({
      title: `Switched to "${chart.title}"`,
      description: `Chart "${chart.title}" imported successfully!`,
      type: "info",
    });
    if (images && typeof images === "object") {
      const toastId = toastQueue.add({
        title: "Importing images...",
        type: "loading",
      });
      await importImagesToDB(images);
      toastQueue.close(toastId);
      toastQueue.add({
        title: "Imported all images from chart",
        type: "info",
      });
    }
  } catch (e) {
    console.error(e);
    toastQueue.close(toastId);
    toastQueue.add({
      title: "Could not import chart",
      description: "There was an error while importing the chart...",
      type: "error",
    });
  }
}

async function getAllChartsFromFile(file: File): Promise<ParsedChart[]> {
  if (file.type !== "application/zip") throw new Error("File is not a zip");

  const zip = await import("@zip.js/zip.js");
  const reader = new zip.ZipReader(new zip.BlobReader(file));

  const entries = await reader.getEntries();
  const numberOfEntries = entries.length;
  if (!numberOfEntries) throw new Error("Tried to load an empty zip file");

  const charts: ParsedChart[] = [];

  for (let i = 0; i < numberOfEntries; i++) {
    const entry = entries[i];
    if (!entry || !entry.getData) continue;
    try {
      const text = await entry.getData(new zip.TextWriter());
      const chart = parseChartFromText(text);
      charts.push(chart);
    } catch (err) {
      console.error(err);
    }
  }

  if (!charts.length) throw new Error("Could not import any chart");

  return charts;
}

function CurrentChartExportModal({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const selectedChart = useSelectedChart();
  const [shouldCompressImages, setShouldCompressImages] = useState(
    () => canUseWebP,
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
    >
      <div className="px-2.5 py-3">
        <div className="flex flex-col gap-1">
          <Toggle
            isSelected={shouldCompressImages}
            onChange={setShouldCompressImages}
            className="flex items-center gap-3 font-semibold"
            aria-describedby="image-compress-description"
          >
            Compress images to reduce size?
          </Toggle>
          <div id="image-compress-description" className="text-sm max-w-[40ch]">
            When enabled, images will be converted to WebP before exporting,
            which allows for much smaller sizes without a noticeable loss in
            quality.
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 dark:border-slate-600 px-2.5 py-2">
        <Button ref={exportButtonRef} onClick={onExport} autoFocus>
          Export
        </Button>
      </div>
    </Modal>
  );
}

function ExportMultipleChartsModal({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const charts = useChartsList();
  const [selectedChartIDs, setSelectedChartIDs] = useState<string[]>(() =>
    charts.map((chart) => chart.id),
  );
  const [shouldCompressImages, setShouldCompressImages] = useState(
    () => canUseWebP,
  );

  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error>();

  const exportSelectedCharts = useCallback(async () => {
    setError(undefined);
    setIsExporting(true);
    try {
      await exportMultipleCharts(
        charts.filter((chart) => selectedChartIDs.includes(chart.id)),
        shouldCompressImages,
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      }
    } finally {
      setIsExporting(false);
    }
  }, [charts, selectedChartIDs, shouldCompressImages]);

  return (
    <Modal
      title="Export multiple charts"
      isOpen={true}
      setOpen={setOpen}
      isDismissable={!isExporting}
      className="space-y-2.5"
    >
      <div className="px-2.5 overflow-auto">
        <CheckboxGroup
          className="rounded border border-gray-800 dark:border-slate-600 divide-y divide-gray-800 dark:divide-slate-600"
          value={selectedChartIDs}
          onChange={setSelectedChartIDs}
          isDisabled={isExporting}
        >
          {charts.map((chart) => (
            <Checkbox
              className="group flex items-center gap-2 px-3 py-2"
              value={chart.id}
              key={chart.id}
            >
              <div
                className="group-[&[data-selected]]:dark:bg-slate-600 border-2 border-gray-800 dark:border-slate-600 rounded flex items-center justify-center transition-all duration-100 w-5 h-5"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 18 18"
                  className="dark:stroke-white stroke-gray-800 fill-none [stroke-width:2px] [stroke-dasharray:22] [stroke-dashoffset:66px] group-[&[data-selected]]:[stroke-dashoffset:44px] w-4 h-4 transition-all duration-100 ml-[2px]"
                >
                  <polyline points="1 9 7 14 15 4" />
                </svg>
              </div>
              {chart.title}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
      <div className="px-2.5 ">
        <div className="flex flex-col gap-1">
          <Toggle
            isSelected={shouldCompressImages}
            onChange={setShouldCompressImages}
            className="flex items-center gap-3 font-semibold"
            aria-describedby="image-compress-description"
          >
            Compress images to reduce size?
          </Toggle>
          <div id="image-compress-description" className="text-sm max-w-[80ch]">
            When enabled, images will be converted to WebP before exporting,
            which allows for much smaller sizes without a noticeable loss in
            quality.
          </div>
        </div>
      </div>
      {error && (
        <div className="px-2.5 bg-red-500 text-white py-0.5 text-sm w-full">
          <div className="max-w-[80ch]">
            <ErrorIcon className="inline w-4 h-4 align-middle mr-2" />
            <span className="align-middle">
              Could not export charts: {error.name}, {error.message}
            </span>
          </div>
        </div>
      )}
      <div className="border-t border-gray-800 dark:border-slate-600 px-2.5 py-2">
        <Button autoFocus onClick={exportSelectedCharts}>
          Export
        </Button>
      </div>
    </Modal>
  );
}

function ImportMultipleChartsModal({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<"success" | Error>();
  const [charts, setCharts] = useState<(Chart & ParsedImages)[]>([]);
  const [selectedChartIDs, setSelectedChartIDs] = useState<string[]>([]);
  const hasChartsToImport = charts.length > 0;

  const importSelectedCharts = useCallback(async () => {
    setIsImporting(true);
    setImportResult(undefined);
    const chartsToImport = charts.filter((chart) =>
      selectedChartIDs.includes(chart.id),
    );
    try {
      let index = 0;
      let lastImportedChartId: string | undefined;
      for (; index < chartsToImport.length; index++) {
        const chart = chartsToImport[index];
        if (!chart)
          throw new Error(
            `Trying to access chart at index ${index} which is not available`,
          );
        addNewChart(chart, chart.id);
        await importImagesToDB(chart.images);
        lastImportedChartId = chart.id;
      }
      if (lastImportedChartId) {
        setSelectedChartId(lastImportedChartId);
      }
      setImportResult("success");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setImportResult(error);
      }
    } finally {
      setIsImporting(false);
      setCharts([]);
      setSelectedChartIDs([]);
    }
  }, [charts, selectedChartIDs]);

  return (
    <Modal
      title="Import multiple charts"
      isOpen={true}
      setOpen={setOpen}
      isDismissable={!isImporting}
      className="space-y-2.5"
    >
      {importResult === "success" && (
        <div className="px-2.5 bg-green-700 text-white py-0.5 !mt-0 text-sm w-full">
          <div className="max-w-[80ch]">
            <SuccessIcon className="inline w-4 h-4 align-middle mr-2" />
            <span className="align-middle">Successfully imported charts</span>
          </div>
        </div>
      )}
      {importResult instanceof Error && (
        <div className="px-2.5 bg-red-500 text-white py-0.5 text-sm w-full !mt-0">
          <div className="max-w-[80ch]">
            <ErrorIcon className="inline w-4 h-4 align-middle mr-2" />
            <span className="align-middle">
              Could not import charts: {importResult.message} Check the console
              for the full error.
            </span>
          </div>
        </div>
      )}
      {!hasChartsToImport && (
        <div className="px-2.5 !mb-1.5">
          <div className="mb-1">
            Pick {importResult ? "another" : ""} file to import:
          </div>
          <input
            type="file"
            onChange={async (event) => {
              const target = event.currentTarget;
              if (!target.files) return;
              const file = target.files[0];
              if (!file) return;
              try {
                const charts = (await getAllChartsFromFile(file)).map(
                  (chart) =>
                    ({ ...chart, id: nanoid() } as Chart & ParsedImages),
                );
                setCharts(charts);
                setSelectedChartIDs(charts.map((chart) => chart.id));
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </div>
      )}
      {hasChartsToImport && (
        <div className="px-2.5 overflow-auto">
          <div className="mb-1">Select charts to import:</div>
          <CheckboxGroup
            className="rounded border border-gray-800 dark:border-slate-600 divide-y divide-gray-800 dark:divide-slate-600"
            value={selectedChartIDs}
            onChange={setSelectedChartIDs}
            isDisabled={isImporting}
          >
            {charts.map((chart) => (
              <Checkbox
                className="group flex items-center gap-2 px-3 py-2"
                value={chart.id}
                key={chart.id}
              >
                <div
                  className="group-[&[data-selected]]:dark:bg-slate-600 border-2 border-gray-800 dark:border-slate-600 rounded flex items-center justify-center transition-all duration-100 w-5 h-5"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 18 18"
                    className="dark:stroke-white stroke-gray-800 fill-none [stroke-width:2px] [stroke-dasharray:22] [stroke-dashoffset:66px] group-[&[data-selected]]:[stroke-dashoffset:44px] w-4 h-4 transition-all duration-100 ml-[2px]"
                  >
                    <polyline points="1 9 7 14 15 4" />
                  </svg>
                </div>
                {chart.title}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>
      )}
      <div className="border-t border-gray-800 dark:border-slate-600 px-2.5 py-2">
        <Button
          autoFocus
          onClick={importSelectedCharts}
          isDisabled={!hasChartsToImport}
        >
          Import
        </Button>
      </div>
    </Modal>
  );
}

export function ImportExportMenu() {
  const [showCurrentChartExportModal, setShowCurrentChartExportModal] =
    useState(false);
  const [showExportMultipleChartsModal, setShowExportMultipleChartsModal] =
    useState(false);
  const [showImportMultipleChartsModal, setShowImportMultipleChartsModal] =
    useState(false);

  const anchorRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <MenuTrigger>
      <Tooltip content="Import/Export">
        <IconButton icon={ImportIcon} label="Import/Export" ref={anchorRef} />
      </Tooltip>
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
      <Menu>
        <MenuItem
          onAction={() => {
            if (!fileInputRef.current) return;
            fileInputRef.current.click();
          }}
        >
          <ImportIcon className="w-5 h-5" />
          Import chart
        </MenuItem>
        <MenuItem
          onAction={() => {
            if (canUseWebP) {
              setShowCurrentChartExportModal(true);
            } else {
              exportSelectedChart(false);
            }
          }}
        >
          <ExportIcon className="w-5 h-5" />
          Export chart
        </MenuItem>
        <MenuItem
          onAction={() => {
            setShowImportMultipleChartsModal(true);
          }}
        >
          <ImportIcon className="w-5 h-5" />
          Import multiple charts
        </MenuItem>
        <MenuItem
          onAction={() => {
            setShowExportMultipleChartsModal(true);
          }}
        >
          <ExportIcon className="w-5 h-5" />
          Export multiple charts
        </MenuItem>
      </Menu>
      {showCurrentChartExportModal && (
        <CurrentChartExportModal setOpen={setShowCurrentChartExportModal} />
      )}
      {showExportMultipleChartsModal && (
        <ExportMultipleChartsModal setOpen={setShowExportMultipleChartsModal} />
      )}
      {showImportMultipleChartsModal && (
        <ImportMultipleChartsModal setOpen={setShowImportMultipleChartsModal} />
      )}
    </MenuTrigger>
  );
}
