import { FormEventHandler, useState } from "react";
import IconButton from "../components/IconButton";
import RadioButtonGroup from "../components/RadioButtonGroup";
import Toggle from "../components/Toggle";
import ColorPickerIcon from "../icons/ColorPickerIcon";
import ImageIcon from "../icons/ImageIcon";
import LinkIcon from "../icons/LinkIcon";
import classNames from "../utils/classNames";

type MusicCollageSpacing = "none" | "small" | "medium" | "large";

const MusicCollageOptions = () => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [gap, setGap] = useState<MusicCollageSpacing>("small");
  const [padding, setPadding] = useState<MusicCollageSpacing>("small");
  const [shouldUseColorForBg, setShouldUseColorForBg] = useState(true);
  const [showAlbumTitles, setShowAlbumTitles] = useState(false);
  const [positionTitlesBelowCover, setShouldPositionTitlesBelowCover] =
    useState(false);
  const [allowEditingTitles, setAllowEditingTitles] = useState(false);

  const onRowsInput: FormEventHandler<HTMLInputElement> = (event) => {
    setRows(parseInt(event.currentTarget.value));
  };

  const onColumnsInput: FormEventHandler<HTMLInputElement> = (event) => {
    setColumns(parseInt(event.currentTarget.value));
  };

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <div className="text-lg font-semibold">Rows:</div>
        <div className="flex gap-3">
          <input
            type="range"
            className="flex-grow "
            value={rows}
            min={1}
            max={10}
            onInput={onRowsInput}
          />
          <input
            type="number"
            className="max-w-[4rem] rounded border border-slate-600 bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400"
            value={rows}
            min={1}
            max={10}
            onInput={onRowsInput}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="text-lg font-semibold">Columns:</div>
        <div className="flex gap-3">
          <input
            type="range"
            className="flex-grow "
            value={columns}
            min={1}
            max={10}
            onInput={onColumnsInput}
          />
          <input
            type="number"
            className="max-w-[4rem] rounded border border-slate-600 bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400"
            value={columns}
            min={1}
            max={10}
            onInput={onColumnsInput}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="text-lg font-semibold">Gap Between Items:</div>
        <RadioButtonGroup
          items={[
            {
              label: "None",
              value: "none",
            },
            {
              label: "Small",
              value: "small",
            },
            {
              label: "Medium",
              value: "medium",
            },
            {
              label: "Large",
              value: "large",
            },
          ]}
          value={gap}
          onChange={(value) => {
            setGap(value as MusicCollageSpacing);
          }}
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="text-lg font-semibold">Padding:</div>
        <RadioButtonGroup
          items={[
            {
              label: "None",
              value: "none",
            },
            {
              label: "Small",
              value: "small",
            },
            {
              label: "Medium",
              value: "medium",
            },
            {
              label: "Large",
              value: "large",
            },
          ]}
          value={padding}
          onChange={(value) => {
            setPadding(value as MusicCollageSpacing);
          }}
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="text-lg font-semibold">Album Titles:</div>
        <label className="flex select-none items-center gap-3">
          <Toggle
            value={showAlbumTitles}
            onChange={(checked) => {
              setShowAlbumTitles(checked);
            }}
          />
          Show album titles
        </label>
        <label
          className={classNames(
            "flex items-center gap-3",
            !showAlbumTitles && "cursor-not-allowed text-gray-500"
          )}
        >
          <Toggle
            disabled={!showAlbumTitles}
            value={positionTitlesBelowCover}
            onChange={(checked) => {
              setShouldPositionTitlesBelowCover(checked);
            }}
          />
          Position album titles below cover
        </label>
        <label
          className={classNames(
            "flex items-center gap-3",
            !showAlbumTitles && "cursor-not-allowed text-gray-500"
          )}
        >
          <Toggle
            disabled={!showAlbumTitles}
            value={allowEditingTitles}
            onChange={(checked) => {
              setAllowEditingTitles(checked);
            }}
          />
          Allow editing titles
        </label>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">
            Background {shouldUseColorForBg ? "Color" : "Image"}:
          </div>
          {shouldUseColorForBg ? (
            <IconButton
              icon={ImageIcon}
              label={"Use image instead"}
              onClick={() => {
                setShouldUseColorForBg(false);
              }}
            />
          ) : (
            <IconButton
              icon={ColorPickerIcon}
              label={"Use color instead"}
              onClick={() => {
                setShouldUseColorForBg(true);
              }}
            />
          )}
        </div>
        {shouldUseColorForBg ? (
          <>
            {/** @TODO Suggestion: List of 10 recently used colors */}
            <div className="flex flex-grow gap-1.5">
              {/* <Input
                placeholder="Enter color..."
                value={selectedChart().options.musicCollage.background.color}
                onChange={(event) => {
                  setMusicCollageBackground(
                    selectedChart().id,
                    "color",
                    event.currentTarget.value
                  );
                }}
              />
              <ColorPickerButton
                value={selectedChart().options.musicCollage.background.color}
                onChange={(value) => {
                  setMusicCollageBackground(selectedChart().id, "color", value);
                }}
                className="px-2.5"
              /> */}
            </div>
          </>
        ) : (
          <>
            {/* <InputWithIcon
              icon={LinkIcon}
              placeholder="Enter image URL..."
              value={selectedChart().options.musicCollage.background.image}
              onChange={(event) => {
                setMusicCollageBackground(
                  selectedChart().id,
                  "image",
                  event.currentTarget.value
                );
              }}
            /> */}
          </>
        )}
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="text-lg font-semibold">Font style:</div>
        {/* <RadioButtonGroup
          name="font-style"
          items={[
            {
              label: "Sans-serif",
              value: "sans",
            },
            {
              label: "Serif",
              value: "serif",
            },
            {
              label: "Monospace",
              value: "mono",
            },
            {
              label: "Custom",
              value: "custom",
            },
          ]}
          value={selectedChart().options.musicCollage.fontStyle}
          onChange={(value: MusicCollageFontStyle) => {
            setMusicCollageFontStyle(selectedChart().id, value);
          }}
        /> */}
        {/* selectedChart().options.musicCollage.fontStyle === "custom" && (
          <Input
            aria-label="Custom font"
            placeholder="Select font"
            value={selectedChart().options.musicCollage.fontFamily}
            onChange={(event) => {
              setMusicCollageFontFamily(
                selectedChart().id,
                event.currentTarget.value
              );
            }}
          />
        ) */}
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="text-lg font-semibold">Text color:</div>
        <div className="flex flex-grow gap-1.5">
          {/* <Input
            placeholder="Enter color..."
            value={selectedChart().options.musicCollage.foregroundColor}
            onChange={(event) => {
              setMusicCollageForegroundColor(
                selectedChart().id,
                event.currentTarget.value
              );
            }}
          />
          <ColorPickerButton
            value={selectedChart().options.musicCollage.foregroundColor}
            onChange={(value) => {
              setMusicCollageForegroundColor(selectedChart().id, value);
            }}
            className="px-2.5"
          /> */}
        </div>
      </div>
    </>
  );
};

export default MusicCollageOptions;
