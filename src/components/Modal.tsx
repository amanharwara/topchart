import { Component, JSX } from "solid-js";
import { Portal } from "solid-js/web";

type Props = {
  children: JSX.Element;
};

const Modal: Component<Props> = (props) => {
  const modalElement = document.createElement("div");
  modalElement.id = `modal-${Math.random()}`;
  document.body.appendChild(modalElement);

  return (
    <Portal mount={modalElement}>
      <div class="overlay" />
      <div class="content">{props.children}</div>
    </Portal>
  );
};

export default Modal;
