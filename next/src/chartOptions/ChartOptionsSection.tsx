import { useState } from "react";
import IconButton from "../components/IconButton";
import Select from "../components/Select";
import AddIcon from "../icons/AddIcon";
import EditIcon from "../icons/EditIcon";
import SaveIcon from "../icons/SaveIcon";
import TrashIcon from "../icons/TrashIcon";
import MusicCollageOptions from "./MusicCollageOptions";

const CurrentChartOption = () => {
  const [selectedChart, setSelectedChart] = useState<string>();

  const [isEditingChart, setIsEditingChart] = useState(false);
  const isSelectingChart = !isEditingChart;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-lg font-semibold">Current chart:</div>
      <div className="flex gap-2">
        {isSelectingChart && (
          <>
            <Select
              value={selectedChart}
              setValue={setSelectedChart}
              options={[
                {
                  label: "test",
                  value: "test",
                },
                {
                  label: "test2",
                  value: "test2",
                },
                {
                  label: "test3",
                  value: "test3",
                },
                {
                  label: "test4",
                  value: "test4",
                },
              ]}
            />
            <IconButton
              className="px-2.5"
              icon={AddIcon}
              label="Add new chart"
              // onClick={() => {
              //   const id = addNewChart();

              //   setSelectedChart(charts.find((chart) => chart.id === id));
              // }}
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
              // onClick={() => {
              //   const shouldDeleteChart = confirm(
              //     `Do you want to delete chart "${selectedChart().title}"?`
              //   );

              //   if (shouldDeleteChart) {
              //     deleteChart(selectedChart().id);
              //   }
              // }}
            />
          </>
        )}
        {isEditingChart && (
          <>
            <input
              className="flex-grow rounded border border-slate-600 bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400"
              placeholder="Enter chart title..."
              // value={currentTitle()}
              // onInput={(event) => {
              //   setCurrentTitle(event.currentTarget.value);
              // }}
            />
            <IconButton
              className="px-2.5"
              icon={SaveIcon}
              label={"Save chart title"}
              onClick={() => {
                // editChartTitle(selectedChart().id, currentTitle());
                setIsEditingChart(false);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

const ChartOptionsSection = () => {
  return (
    <section className="flex flex-col gap-6 overflow-y-auto bg-gray-800 py-4 px-5 text-white">
      <CurrentChartOption />
      <div className="flex flex-col gap-2.5">
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
      </div>
      <MusicCollageOptions />
    </section>
  );
};

export default ChartOptionsSection;
