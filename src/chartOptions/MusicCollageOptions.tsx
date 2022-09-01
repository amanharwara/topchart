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
  useSelectedMusicCollageAlbumTitlesPosition,
  useSelectedMusicCollageAllowEditingTitles,
  useSelectedMusicCollageBackgroundColor,
  useSelectedMusicCollageBackgroundImage,
  useSelectedMusicCollageBackgroundType,
  useSelectedMusicCollageColumns,
  useSelectedMusicCollageFontFamily,
  useSelectedMusicCollageFontStyle,
  useSelectedMusicCollageForegroundColor,
  useSelectedMusicCollageGap,
  useSelectedMusicCollagePadding,
  useSelectedMusicCollageRows,
  useSelectedMusicCollageShowAlbumTitles,
} from "../stores/charts";
import classNames from "../utils/classNames";

const RowsOption = () => {
  const [rows, setRows] = useSelectedMusicCollageRows();

  const onRowsInput: FormEventHandler<HTMLInputElement> = (event) => {
    setRows(parseInt(event.currentTarget.value));
  };

  return (
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
  );
};

const ColumnsOption = () => {
  const [columns, setColumns] = useSelectedMusicCollageColumns();

  const onColumnsInput: FormEventHandler<HTMLInputElement> = (event) => {
    setColumns(parseInt(event.currentTarget.value));
  };

  return (
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
  );
};

export const AlbumTitlesOption = () => {
  const [showAlbumTitles, setShowAlbumTitles] =
    useSelectedMusicCollageShowAlbumTitles();
  const [positionTitlesBelowCover, setShouldPositionTitlesBelowCover] =
    useSelectedMusicCollageAlbumTitlesPosition();
  const [allowEditingTitles, setAllowEditingTitles] =
    useSelectedMusicCollageAllowEditingTitles();

  return (
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
  );
};

const GapOption = () => {
  const [gap, setGap] = useSelectedMusicCollageGap();

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
          setGap(value as MusicCollageSpacing);
        }}
      />
    </div>
  );
};

const PaddingOption = () => {
  const [padding, setPadding] = useSelectedMusicCollagePadding();

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
          setPadding(value as MusicCollageSpacing);
        }}
      />
    </div>
  );
};

const BackgroundOption = () => {
  const [backgroundType, setBackgroundType] =
    useSelectedMusicCollageBackgroundType();
  const [backgroundImage, setBackgroundImage] =
    useSelectedMusicCollageBackgroundImage();
  const [backgroundColor, setBackgroundColor] =
    useSelectedMusicCollageBackgroundColor();

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
              setBackgroundType("image");
            }}
          />
        ) : (
          <IconButton
            icon={ColorPickerIcon}
            label={"Use color instead"}
            onClick={() => {
              setBackgroundType("color");
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
              setBackgroundColor(event.currentTarget.value);
            }}
          />
          <ColorPickerButton
            value={backgroundColor}
            onChange={(value) => {
              setBackgroundColor(value);
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
            setBackgroundImage(event.currentTarget.value);
          }}
        />
      )}
    </div>
  );
};

const FontOption = () => {
  const [fontStyle, setFontStyle] = useSelectedMusicCollageFontStyle();
  const [fontFamily, setFontFamily] = useSelectedMusicCollageFontFamily();

  return (
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
          setFontStyle(value as MusicCollageFontStyle);
        }}
      />
      {fontStyle === "custom" && (
        <Input
          aria-label="Custom font"
          placeholder="Select font"
          value={fontFamily}
          onChange={(event) => {
            setFontFamily(event.currentTarget.value);
          }}
        />
      )}
    </div>
  );
};

const TextColorOption = () => {
  const [foregroundColor, setForegroundColor] =
    useSelectedMusicCollageForegroundColor();

  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-lg font-semibold">Text color:</div>
      <div className="flex flex-grow gap-1.5">
        <Input
          placeholder="Enter color..."
          value={foregroundColor}
          onChange={(event) => {
            setForegroundColor(event.currentTarget.value);
          }}
        />
        <ColorPickerButton
          value={foregroundColor}
          onChange={(value) => {
            setForegroundColor(value);
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
      <AlbumTitlesOption />
      <BackgroundOption />
      <FontOption />
      <TextColorOption />
    </>
  );
};

export default MusicCollageOptions;
