import ColorPickerButton from "../components/ColorPickerButton";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import InputWithIcon from "../components/InputWithIcon";
import RadioButtonGroup from "../components/RadioButtonGroup";
import Select from "../components/Select";
import Toggle from "../components/Toggle";
import ColorPickerIcon from "../icons/ColorPickerIcon";
import ImageIcon from "../icons/ImageIcon";
import LinkIcon from "../icons/LinkIcon";
import {
  type MusicCollage,
  type MusicCollageFontStyle,
  type MusicCollageSpacing,
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
  useSelectedMusicCollageProperty,
} from "../stores/charts";
import classNames from "../utils/classNames";
import SliderOption from "./SliderOption";

const RowsOption = () => {
  const rows = useSelectedMusicCollageProperty("rows");

  return (
    <SliderOption
      label="Rows"
      value={rows}
      onChange={(value) => {
        setMusicCollageRows(value);
      }}
    />
  );
};

const ColumnsOption = () => {
  const columns = useSelectedMusicCollageProperty("columns");

  return (
    <SliderOption
      label="Columns"
      value={columns}
      onChange={(value) => {
        setMusicCollageColumns(value);
      }}
    />
  );
};

const GapOption = () => {
  const gap = useSelectedMusicCollageProperty("gap");

  return (
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
  );
};

const PaddingOption = () => {
  const padding = useSelectedMusicCollageProperty("padding");

  return (
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
  );
};

const AlbumTitleOptions = () => {
  const showTitles = useSelectedMusicCollageProperty("showTitles");
  const positionTitlesBelowCover = useSelectedMusicCollageProperty(
    "positionTitlesBelowCover"
  );
  const allowEditingTitles =
    useSelectedMusicCollageProperty("allowEditingTitles");

  return (
    <>
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
    </>
  );
};

const BackgroundOption = () => {
  const backgroundColor = useSelectedMusicCollageProperty("backgroundColor");
  const backgroundImage = useSelectedMusicCollageProperty("backgroundImage");
  const backgroundType = useSelectedMusicCollageProperty("backgroundType");

  const shouldUseColorForBg = backgroundType === "color";

  return (
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
            className="min-w-0"
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
  );
};

const FontOption = () => {
  const fontStyle = useSelectedMusicCollageProperty("fontStyle");
  const fontFamily = useSelectedMusicCollageProperty("fontFamily");

  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-lg font-semibold">Font style:</div>
      <Select
        value={fontStyle}
        setValue={(value) =>
          setMusicCollageFontStyle(value as MusicCollageFontStyle)
        }
        options={[
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
  );
};

const ForegroundColorOption = () => {
  const foregroundColor = useSelectedMusicCollageProperty("foregroundColor");

  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-lg font-semibold">Text color:</div>
      <div className="flex flex-grow gap-1.5">
        <Input
          className="min-w-0"
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
  );
};

const MusicCollageOptions = () => {
  return (
    <>
      <RowsOption />
      <ColumnsOption />
      <GapOption />
      <PaddingOption />
      <AlbumTitleOptions />
      <BackgroundOption />
      <FontOption />
      <ForegroundColorOption />
    </>
  );
};

export default MusicCollageOptions;
