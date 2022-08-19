import { useRef, useState } from "react";
import Input from "../components/Input";
import SaveIcon from "../icons/SaveIcon";
import { MusicCollageItem } from "./MusicCollage";

const EditTitleModal = () => {
  const inputElementRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");

  const saveTitle = (item: MusicCollageItem) => {
    const titleToSave = title;

    if (!titleToSave) {
      inputElementRef.current?.focus();
      return;
    }

    // const { rowIndex, itemIndex } = editingTitleFor();

    // setMusicCollageItem(selectedChart().id, rowIndex, itemIndex, {
    //   ...item,
    //   title: titleToSave,
    // });

    // setEditingTitleFor(undefined);
  };

  return {
    /* <Show
      when={
        selectedChart().options.musicCollage.items[
          editingTitleFor()?.rowIndex
        ]?.[editingTitleFor()?.itemIndex]
      }
    >
      {(item) => {
        setTitle(item.title);

        return (
          <Modal
            title="Edit title"
            isOpen={true}
            closeModal={() => {
              if (title() && item.title) {
                setEditingTitleFor(undefined);
              } else {
                inputElementRef.focus();
              }
            }}
          >
            <form
              class="flex flex-col items-start gap-2.5 px-2.5 py-3"
              onSubmit={(event) => {
                event.preventDefault();
                saveTitle(item);
              }}
            >
              <Input
                class="w-full"
                value={item.title}
                onChange={(event) => {
                  setTitle(event.currentTarget.value);
                }}
                ref={(el) => {
                  inputElementRef = el;
                  setTimeout(() => {
                    el.focus();
                  });
                }}
                placeholder="Add title..."
              />
              <Button type="submit" icon={SaveIcon}>
                Save
              </Button>
            </form>
          </Modal>
        );
      }}
    </Show> */
  };
};

export default EditTitleModal;
