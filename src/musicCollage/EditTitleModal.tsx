import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import SaveIcon from "../icons/SaveIcon";
import {
  getMusicCollageItem,
  useSelectedMusicCollageEditingTitleFor,
  useSetMusicCollageItemTitle,
} from "../stores/charts";

const EditTitleModal = () => {
  const setMusicCollageItemTitle = useSetMusicCollageItemTitle();
  const [editingTitleFor, setEditingTitleFor] =
    useSelectedMusicCollageEditingTitleFor();
  const itemToEdit = getMusicCollageItem(editingTitleFor);

  const inputElementRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(itemToEdit?.title ?? "");
  }, [itemToEdit]);

  const saveTitle = () => {
    const titleToSave = title;

    if (!titleToSave) {
      inputElementRef.current?.focus();
      return;
    }

    setMusicCollageItemTitle(editingTitleFor, titleToSave);

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
          saveTitle();
        }}
      >
        <Input
          className="w-full"
          value={title}
          onChange={(event) => {
            setTitle(event.currentTarget.value);
          }}
          // ref={inputElementRef}
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
