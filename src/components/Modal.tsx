import {
  Component,
  createEffect,
  JSX,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { Portal } from "solid-js/web";
import CloseIcon from "./icons/CloseIcon";

type Props = {
  children: JSX.Element;
  title?: string;
  isOpen: boolean;
  closeModal: () => void;
};

const Modal: Component<Props> = (props) => {
  let closeButtonRef: HTMLButtonElement | undefined;

  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      props.closeModal();
    }
  };

  createEffect(() => {
    if (props.isOpen) {
      closeButtonRef?.focus();
    }
  });

  onMount(() => {
    document.addEventListener("keydown", closeOnEscape);
  });

  onCleanup(() => {
    document.removeEventListener("keydown", closeOnEscape);
  });

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div
          class="absolute top-0 left-0 h-full w-full bg-gray-900 opacity-60"
          onClick={props.closeModal}
        />
        <div class="absolute top-1/2 left-1/2 min-w-96 -translate-y-1/2 -translate-x-1/2 rounded-sm bg-slate-700 text-white shadow">
          <div class="flex w-full items-center border-b border-slate-600">
            <div class="flex-grow px-3 text-sm font-semibold">
              {props.title}
            </div>
            <button
              class="flex items-center border-l border-slate-600 p-2.5 hover:bg-slate-600"
              onClick={props.closeModal}
              ref={closeButtonRef}
            >
              <CloseIcon class="h-4 w-4 text-white" />
            </button>
          </div>
          {props.children}
        </div>
      </Portal>
    </Show>
  );
};

export default Modal;
