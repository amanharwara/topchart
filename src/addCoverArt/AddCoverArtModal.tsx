import Modal from "../components/Modal";
import {
  getMusicCollageItem,
  useSelectedMusicCollageAddingCoverTo,
} from "../stores/charts";
import AddCoverArt from "./AddCoverArt";

const AddCoverArtModal = () => {
  const [addingCoverTo, setAddingCoverTo] =
    useSelectedMusicCollageAddingCoverTo();
  const itemToAddCoverTo = getMusicCollageItem(addingCoverTo);

  return itemToAddCoverTo ? (
    <Modal
      title="Add cover art"
      isOpen={true}
      setOpen={() => setAddingCoverTo(-1)}
    >
      <AddCoverArt itemIndex={addingCoverTo} />
    </Modal>
  ) : null;
};

export default AddCoverArtModal;
