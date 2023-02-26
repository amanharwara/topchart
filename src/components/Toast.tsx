import { normalizeProps, useActor, useMachine } from "@zag-js/react";
import * as toast from "@zag-js/toast";
import { createContext, ReactNode, useContext, useId } from "react";
import CloseIcon from "../icons/CloseIcon";
import ErrorIcon from "../icons/ErrorIcon";
import classNames from "../utils/classNames";
import Spinner from "./Spinner";

const ToastContext = createContext<
  ReturnType<typeof toast.group.connect> | undefined
>(undefined);
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("ToastContext is undefined");
  return context;
};

const Toast = ({ actor }: { actor: toast.Service }) => {
  const [state, send] = useActor(actor);
  const api = toast.connect(state, send, normalizeProps);

  return (
    <div
      className={classNames(
        "flex items-start gap-2 rounded py-2 max-w-[95vw] bg-white border border-slate-800 dark:bg-slate-700 dark:text-white",
        api.type === "loading" ? "px-3" : "px-2.5"
      )}
      {...api.rootProps}
    >
      <div className="flex flex-col gap-0.5 max-w-[30ch] overflow-hidden">
        <div
          className="flex items-center gap-2 text-base font-semibold overflow-hidden"
          {...api.titleProps}
        >
          {api.type === "loading" && (
            <Spinner className="w-4 h-4 flex-shrink-0" />
          )}
          {api.type === "error" && (
            <ErrorIcon className="w-4 h-4 flex-shrink-0" />
          )}
          <div className="whitespace-nowrap text-ellipsis overflow-hidden">
            {api.title}
          </div>
        </div>
        <p className="text-sm" {...api.descriptionProps}>
          {api.description}
        </p>
      </div>
      {api.type !== "loading" && (
        <button
          className="flex-shrink-0 border border-slate-600 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 rounded"
          onClick={api.dismiss}
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [state, send] = useMachine(
    toast.group.machine({
      id: useId(),
    })
  );

  const api = toast.group.connect(state, send, normalizeProps);

  return (
    <ToastContext.Provider value={api}>
      {Object.entries(api.toastsByPlacement).map(([placement, toasts]) => (
        <div
          key={placement}
          {...api.getGroupProps({ placement: placement as toast.Placement })}
        >
          {toasts.map((toast) => (
            <Toast key={toast.id} actor={toast} />
          ))}
        </div>
      ))}
      {children}
    </ToastContext.Provider>
  );
};
