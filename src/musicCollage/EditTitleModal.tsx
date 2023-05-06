import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import SaveIcon from "../icons/SaveIcon";
import {
  getMusicCollageItem,
  useSelectedMusicCollageEditingTitleFor,
  useSetMusicCollageItem,
} from "../stores/charts";
import { MusicCollageItem } from "../stores/charts";

const EditTitleModal = () => {
  const setMusicCollageItem = useSetMusicCollageItem();
  const [editingTitleFor, setEditingTitleFor] =
    useSelectedMusicCollageEditingTitleFor();
  const itemToEdit = getMusicCollageItem(editingTitleFor);

  const inputElementRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(itemToEdit?.title ?? "");
  }, [itemToEdit]);

  const saveTitle = (item: MusicCollageItem) => {
    const titleToSave = title;

    if (!titleToSave) {
      inputElementRef.current?.focus();
      return;
    }

    setMusicCollageItem(editingTitleFor, {
      ...item,
      title: titleToSave,
    });

    setEditingTitleFor(-1);
  };

  return itemToEdit ? (
    <Modal
      title="Edit title"
      isOpen={true}
      setOpen={() => {
        if (title && itemToEdit.title) {
          setEditingTitleFor(-1);
        } else {
          inputElementRef.current?.focus();
        }
      }}
    >
      <form
        className="flex flex-col items-start gap-2.5 px-2.5 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          saveTitle(itemToEdit);
        }}
      >
        <Input
          className="w-full"
          value={title}
          onChange={(event) => {
            setTitle(event.currentTarget.value);
          }}
          ref={inputElementRef}
          placeholder="Add title..."
        />
        <Button type="submit" icon={SaveIcon}>
          Save
        </Button>
      </form>
    </Modal>
  ) : null;
};

export default EditTitleModal;
