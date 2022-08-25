import { useEffect, useState } from "react";
import IconButton from "../components/IconButton";
import Select from "../components/Select";
import AddIcon from "../icons/AddIcon";
import EditIcon from "../icons/EditIcon";
import SaveIcon from "../icons/SaveIcon";
import TrashIcon from "../icons/TrashIcon";
import {
  useAddChart,
  useChartsList,
  useSelectedChart,
  useSetSelectedChartId,
  useSetSelectedChartTitle,
} from "../stores/charts";
import MusicCollageOptions from "./MusicCollageOptions";

const CurrentChartOption = () => {
  const selectedChart = useSelectedChart();
  const setSelectedChartId = useSetSelectedChartId();
  const setSelectedChartTitle = useSetSelectedChartTitle();
  const charts = useChartsList();
  const addNewChart = useAddChart();

  const [isEditingChart, setIsEditingChart] = useState(false);
  const isSelectingChart = !isEditingChart;

  const [currentTitle, setCurrentTitle] = useState(selectedChart?.title);

  useEffect(() => {
    setCurrentTitle(selectedChart?.title);
  }, [selectedChart]);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-lg font-semibold">Current chart:</div>
      <div className="flex gap-2">
        {isSelectingChart && (
          <>
            <Select
              value={selectedChart!.id}
              setValue={setSelectedChartId}
              options={charts.map(({ id, title }) => ({
                value: id,
                label: title,
              }))}
            />
            <IconButton
              className="px-2.5"
              icon={AddIcon}
              label="Add new chart"
              onClick={() => {
                const id = addNewChart();
                setSelectedChartId(id);
              }}
            />
            <IconButton
              className="px-2.5"
              icon={EditIcon}
              label="Edit chart title"
              onClick={() => {
                setIsEditingChart(true);
              }}
            />
            <IconButton
              className="px-2.5"
              icon={TrashIcon}
              label="Delete chart"
              onClick={() => {
                const shouldDeleteChart = confirm(
                  `Do you want to delete chart "${selectedChart!.title}"?`
                );

                /* if (shouldDeleteChart) {
                  deleteChart(selectedChart().id);
                } */
              }}
            />
          </>
        )}
        {isEditingChart && (
          <form
            className="flex flex-grow gap-2"
            onSubmit={(event) => {
              event.preventDefault();

              if (!currentTitle) {
                return;
              }

              setSelectedChartTitle(currentTitle);
              setIsEditingChart(false);
            }}
          >
            <input
              className="flex-grow rounded border border-slate-600 bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400"
              placeholder="Enter chart title..."
              value={currentTitle}
              onInput={(event) => {
                setCurrentTitle(event.currentTarget.value);
              }}
              ref={(element) => {
                if (document.activeElement !== element) {
                  element?.focus();
                }
              }}
            />
            <IconButton
              type="submit"
              className="px-2.5"
              icon={SaveIcon}
              label={"Save chart title"}
            />
          </form>
        )}
      </div>
    </div>
  );
};

const ChartOptionsSection = () => {
  return (
    <section className="flex flex-col gap-6 overflow-y-auto bg-gray-800 py-4 px-5 text-white">
      <CurrentChartOption />
      {/* <div className="flex flex-col gap-2.5">
        <div className="text-lg font-semibold">Chart type:</div>
        <div className="flex gap-3">
          <Select
            options={Object.entries({
              musicCollage: "Music Collage",
            }).map(([value, label]) => ({
              value,
              label,
            }))}
          />
        </div>
      </div> */}
      <MusicCollageOptions />
    </section>
  );
};

export default ChartOptionsSection;