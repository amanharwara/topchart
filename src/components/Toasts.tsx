import { nanoid } from "nanoid";
import { Component, For, Match, onCleanup, onMount, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import { TransitionGroup } from "solid-transition-group";
import classNames from "../utils/classNames";
import SuccessIcon from "./icons/SuccessIcon";
import ErrorIcon from "./icons/ErrorIcon";

type ToastAction = {
  label: string;
  onClick: (toast: Toast) => void;
};

type ToastType = "regular" | "success" | "error" | "loading";

type Toast = {
  actions: ToastAction[];
  autoClose: boolean;
  duration: number;
  id: string;
  message: string;
  type: ToastType;
};

type ToastOptions = {
  actions?: ToastAction[];
  autoClose?: boolean;
  duration?: number;
  id?: string;
  message: string;
  type?: ToastType;
};

const ToastDurationMap: Record<ToastType, number> = {
  regular: 4000,
  error: 8000,
  success: 6000,
  loading: Infinity,
} as const;

const [toasts, setToasts] = createStore<Toast[]>([]);

export const dismissToast = (id: Toast["id"]) => {
  setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
};

export const addToast = (options: ToastOptions) => {
  const id = options.id || nanoid();

  const type = options.type || "regular";
  const actions =
    options.actions && options.actions.length ? options.actions : [];
  const duration = options.duration ? options.duration : ToastDurationMap[type];
  const autoClose =
    typeof options.autoClose !== "undefined" ? options.autoClose : true;

  const toast: Toast = {
    message: options.message,
    actions,
    duration,
    id,
    autoClose,
    type,
  };

  setToasts(toasts.length, toast);

  return id;
};

const Toast: Component<Toast> = (props) => {
  let toastElement: HTMLDivElement | null;
  let toastTimerId: number;

  let startTime = props.duration;
  let remainingTime = props.duration;

  const clearTimer = () => {
    if (toastTimerId) clearTimeout(toastTimerId);
  };

  const pauseTimer = () => {
    clearTimer();
    remainingTime -= Date.now() - startTime;
  };

  const resumeTimer = () => {
    startTime = Date.now();
    clearTimer();
    if (props.type !== "loading" && props.autoClose) {
      toastTimerId = window.setTimeout(() => {
        dismissToast(props.id);
      }, remainingTime);
    }
  };

  onMount(() => {
    clearTimer();

    resumeTimer();

    window.addEventListener("focus", resumeTimer);
    window.addEventListener("blur", pauseTimer);
  });

  onCleanup(() => {
    clearTimer();
    window.removeEventListener("focus", resumeTimer);
    window.removeEventListener("blur", pauseTimer);
  });

  return (
    <div
      class={classNames(
        "flex items-center gap-2.5 rounded bg-slate-700 text-sm text-white",
        "transition-opacity duration-100",
        props.actions.length ? "py-2 px-2.5" : "py-2.5 px-3.5"
      )}
      onClick={() => {
        if (props.type !== "loading") dismissToast(props.id);
      }}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      ref={toastElement}
    >
      <Switch>
        <Match when={props.type === "error"}>
          <div class="h-5 w-5 rounded-full bg-white">
            <ErrorIcon class="h-5 w-5 text-red-600" />
          </div>
        </Match>
        <Match when={props.type === "success"}>
          <div class="h-5 w-5 rounded-full bg-white">
            <SuccessIcon class="h-5 w-5 text-green-600" />
          </div>
        </Match>
        <Match when={props.type === "loading"}>
          <div class="h-5 w-5 animate-spin rounded-full border-2 border-solid border-blue-400 border-r-transparent" />
        </Match>
      </Switch>
      {props.message}
      {!!props.actions.length && (
        <For each={props.actions}>
          {(action) => (
            <button
              class="rounded bg-slate-600 p-1 px-1.5 hover:bg-slate-500"
              onClick={() => {
                action.onClick(props);
              }}
            >
              {action.label}
            </button>
          )}
        </For>
      )}
    </div>
  );
};

export const ToastContainer: Component = () => {
  return (
    <div class="absolute bottom-4 right-4 flex flex-col items-end gap-2.5">
      <TransitionGroup
        onEnter={(el, done) => {
          const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 150,
          });
          a.finished.then(done);
        }}
        onExit={(el, done) => {
          const a = el.animate(
            [
              {
                opacity: 1,
                height: `${el.scrollHeight}px`,
                minHeight: "initial",
              },
              { opacity: 0, height: 0, padding: 0, margin: 0 },
            ],
            {
              duration: 150,
            }
          );
          a.finished.then(done);
        }}
      >
        <For each={toasts}>{(toast) => <Toast {...toast} />}</For>
      </TransitionGroup>
    </div>
  );
};
