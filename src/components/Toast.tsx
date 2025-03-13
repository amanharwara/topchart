import CloseIcon from "../icons/CloseIcon";
import ErrorIcon from "../icons/ErrorIcon";
import classNames from "../utils/classNames";
import Spinner from "./Spinner";
import {
  Button,
  UNSTABLE_Toast,
  UNSTABLE_ToastContent,
  UNSTABLE_ToastQueue,
  UNSTABLE_ToastRegion,
  Text,
} from "react-aria-components";

interface ToastContentInterface {
  title: string;
  description?: string;
  type: "info" | "error" | "loading";
}

export const toastQueue = new UNSTABLE_ToastQueue<ToastContentInterface>();

export function ToastRegion() {
  return (
    <UNSTABLE_ToastRegion
      queue={toastQueue}
      className="fixed bottom-4 right-4 flex flex-col-reverse gap-2"
    >
      {({ toast }) => (
        <UNSTABLE_Toast
          toast={toast}
          className={classNames(
            "flex items-start gap-2 rounded py-2 max-w-[95vw] bg-white border border-slate-800 dark:bg-slate-700 dark:text-white",
            toast.content.type === "loading" ? "px-3" : "px-2.5"
          )}
        >
          <UNSTABLE_ToastContent>
            <div className="flex flex-col gap-0.5 max-w-[30ch] overflow-hidden">
              <div className="flex items-center gap-2 text-base font-semibold overflow-hidden">
                {toast.content.type === "loading" && (
                  <Spinner className="w-4 h-4 flex-shrink-0" />
                )}
                {toast.content.type === "error" && (
                  <ErrorIcon className="w-4 h-4 flex-shrink-0" />
                )}
                <Text
                  slot="title"
                  className="whitespace-nowrap text-ellipsis overflow-hidden"
                >
                  {toast.content.title}
                </Text>
              </div>
              <Text slot="description" className="text-sm">
                {toast.content.description}
              </Text>
            </div>
          </UNSTABLE_ToastContent>
          {toast.content.type !== "loading" && (
            <Button
              slot="close"
              className="ml-auto flex-shrink-0 border border-slate-600 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 rounded"
            >
              <CloseIcon className="w-5 h-5" />
            </Button>
          )}
        </UNSTABLE_Toast>
      )}
    </UNSTABLE_ToastRegion>
  );
}
