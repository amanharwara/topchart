import { nanoid } from "nanoid";
import { Component, For, Match, Switch } from "solid-js";
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
  message: string;
  actions: ToastAction[];
  duration: number;
  id: string;
  manuallyClose: boolean;
  type: ToastType;
};

type ToastOptions = {
  message: string;
  actions?: ToastAction[];
  duration?: number;
  id?: string;
  manuallyClose?: boolean;
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
  const duration = ToastDurationMap[type];
  const manuallyClose =
    typeof options.manuallyClose !== "undefined"
      ? options.manuallyClose
      : false;

  const toast: Toast = {
    message: options.message,
    actions,
    duration,
    id,
    manuallyClose,
    type,
  };

  setToasts(toasts.length, toast);

  if (toast.type !== "loading" && !manuallyClose) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }

  return id;
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
        <For each={toasts}>
          {(toast) => (
            <div
              class={classNames(
                "flex items-center gap-2.5 rounded bg-slate-700 py-2.5 px-3.5 text-sm text-white",
                "transition-opacity duration-100"
              )}
              onClick={() => {
                if (toast.manuallyClose) {
                  dismissToast(toast.id);
                }
              }}
            >
              <Switch>
                <Match when={toast.type === "error"}>
                  <div class="h-5.5 w-5.5 rounded-full bg-white">
                    <ErrorIcon class="h-5.5 w-5.5 text-red-600" />
                  </div>
                </Match>
                <Match when={toast.type === "success"}>
                  <div class="h-5.5 w-5.5 rounded-full bg-white">
                    <SuccessIcon class="h-5.5 w-5.5 text-green-600" />
                  </div>
                </Match>
                <Match when={toast.type === "loading"}>
                  <div class="h-5.5 w-5.5 animate-spin rounded-full border-2 border-solid border-blue-400 border-r-transparent" />
                </Match>
              </Switch>
              {toast.message}
              {!!toast.actions.length && (
                <For each={toast.actions}>
                  {(action) => (
                    <button
                      class="rounded bg-slate-600 p-1 px-1.5 hover:bg-slate-500"
                      onClick={() => {
                        action.onClick(toast);
                      }}
                    >
                      {action.label}
                    </button>
                  )}
                </For>
              )}
            </div>
          )}
        </For>
      </TransitionGroup>
    </div>
  );
};
