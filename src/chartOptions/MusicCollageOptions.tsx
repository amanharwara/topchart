import { FormEventHandler } from "react";
import ColorPickerButton from "../components/ColorPickerButton";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import InputWithIcon from "../components/InputWithIcon";
import RadioButtonGroup from "../components/RadioButtonGroup";
import Toggle from "../components/Toggle";
import ColorPickerIcon from "../icons/ColorPickerIcon";
import ImageIcon from "../icons/ImageIcon";
import LinkIcon from "../icons/LinkIcon";
import {
  MusicCollageFontStyle,
  MusicCollageSpacing,
  setAllowEditingMusicCollageTitles,
  setMusicCollageBackgroundColor,
  setMusicCollageBackgroundImage,
  setMusicCollageBackgroundType,
  setMusicCollageColumns,
  setMusicCollageFontFamily,
  setMusicCollageFontStyle,
  setMusicCollageForegroundColor,
  setMusicCollageGap,
  setMusicCollagePadding,
  setMusicCollageRows,
  setPositionMusicCollageTitlesBelowCover,
  setShowMusicCollageAlbumTitles,
  useSelectedChart,
} from "../stores/charts";
import classNames from "../utils/classNames";
import SliderOption from "./SliderOption";

const MusicCollageOptions = () => {
  const chart = useSelectedChart();

  if (!chart) return null;

  const {
    rows,
    columns,
    gap,
    padding,
    foregroundColor,
    showTitles,
    positionTitlesBelowCover,
    allowEditingTitles,
    backgroundType,
    backgroundImage,
    backgroundColor,
    fontStyle,
    fontFamily,
  } = chart.options.musicCollage;

  const onRowsInput: FormEventHandler<HTMLInputElement> = (event) => {
    setMusicCollageRows(parseInt(event.currentTarget.value));
  };

  const onColumnsInput: FormEventHandler<HTMLInputElement> = (event) => {
    setMusicCollageColumns(parseInt(event.currentTarget.value));
  };

  const shouldUseColorForBg = backgroundType === "color";

  return (
    <>
      <SliderOption
        label="Rows"
        value={rows}
        onChange={(value) => {
          setMusicCollageRows(value);
        }}
      />
      <SliderOption
        label="Columns"
        value={columns}
        onChange={(value) => {
          setMusicCollageColumns(value);
        }}
      />
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
            setMusicCollageGap(value as MusicCollageSpacing);
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
            setMusicCollagePadding(value as MusicCollageSpacing);
          }}
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="text-lg font-semibold">Album Titles:</div>
        <label className="flex select-none items-center gap-3">
          <Toggle
            value={showTitles}
            onChange={(checked) => {
              setShowMusicCollageAlbumTitles(checked);
            }}
          />
          Show album titles
        </label>
        <label
          className={classNames(
            "flex items-center gap-3",
            !showTitles && "cursor-not-allowed text-gray-500"
          )}
        >
          <Toggle
            disabled={!showTitles}
            value={positionTitlesBelowCover}
            onChange={(checked) => {
              setPositionMusicCollageTitlesBelowCover(checked);
            }}
          />
          Position album titles below cover
        </label>
        <label
          className={classNames(
            "flex items-center gap-3",
            !showTitles && "cursor-not-allowed text-gray-500"
          )}
        >
          <Toggle
            disabled={!showTitles}
            value={allowEditingTitles}
            onChange={(checked) => {
              setAllowEditingMusicCollageTitles(checked);
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
                setMusicCollageBackgroundType("image");
              }}
            />
          ) : (
            <IconButton
              icon={ColorPickerIcon}
              label={"Use color instead"}
              onClick={() => {
                setMusicCollageBackgroundType("color");
              }}
            />
          )}
        </div>
        {shouldUseColorForBg ? (
          <div className="flex flex-grow gap-1.5">
            <Input
              placeholder="Enter color..."
              value={backgroundColor}
              onChange={(event) => {
                setMusicCollageBackgroundColor(event.currentTarget.value);
              }}
            />
            <ColorPickerButton
              value={backgroundColor}
              onChange={(value) => {
                setMusicCollageBackgroundColor(value);
              }}
              className="px-2.5"
            />
          </div>
        ) : (
          <InputWithIcon
            icon={LinkIcon}
            placeholder="Enter image URL..."
            value={backgroundImage}
            onChange={(event) => {
              setMusicCollageBackgroundImage(event.currentTarget.value);
            }}
          />
        )}
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="text-lg font-semibold">Font style:</div>
        <RadioButtonGroup
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
          value={fontStyle}
          onChange={(value) => {
            setMusicCollageFontStyle(value as MusicCollageFontStyle);
          }}
        />
        {fontStyle === "custom" && (
          <Input
            aria-label="Custom font"
            placeholder="Select font"
            value={fontFamily}
            onChange={(event) => {
              setMusicCollageFontFamily(event.currentTarget.value);
            }}
          />
        )}
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="text-lg font-semibold">Text color:</div>
        <div className="flex flex-grow gap-1.5">
          <Input
            placeholder="Enter color..."
            value={foregroundColor}
            onChange={(event) => {
              setMusicCollageForegroundColor(event.currentTarget.value);
            }}
          />
          <ColorPickerButton
            value={foregroundColor}
            onChange={(value) => {
              setMusicCollageForegroundColor(value);
            }}
            className="px-2.5"
          />
        </div>
      </div>
    </>
  );
};

export default MusicCollageOptions;
