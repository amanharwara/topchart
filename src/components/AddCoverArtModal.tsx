import { Component } from "solid-js";
import AddCoverArt from "./AddCoverArt";
import Modal from "./Modal";

const AddCoverArtModal: Component<{
  isOpen: boolean;
  closeModal: () => void;
}> = (props) => {
  return (
    <Modal
      isOpen={props.isOpen}
      closeModal={props.closeModal}
      title="Add cover art"
    >
      <AddCoverArt />
    </Modal>
  );
};

export default AddCoverArtModal;
