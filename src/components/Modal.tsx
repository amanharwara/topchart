import {
  Dialog,
  DialogDismiss,
  DialogHeading,
  DialogOptions,
  useDialogStore,
} from "@ariakit/react";
import { ReactNode } from "react";
import CloseIcon from "../icons/CloseIcon";

type Props = {
  title: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
} & Omit<DialogOptions<"div">, "store">;

const Modal = ({ title, isOpen, setOpen, children, ...props }: Props) => {
  const state = useDialogStore({
    open: isOpen,
    setOpen,
  });

  const mounted = state.useState("mounted");

  return (
    <Dialog
      store={state}
      className="absolute top-1/2 left-1/2 flex max-h-[calc(var(--viewport-height,_100vh)_-_2rem)] min-w-full -translate-y-1/2 -translate-x-1/2 flex-col rounded-sm dark:bg-slate-700 bg-slate-100 dark:text-white shadow sm:min-w-96 [&>*]:max-h-[85vh]"
      {...props}
    >
      <div className="flex w-full items-center border-b border-gray-800 dark:border-slate-600">
        <DialogHeading className="flex-grow px-3 text-sm font-semibold">
          {title}
        </DialogHeading>
        <DialogDismiss
          className="flex items-center border-l border-gray-800 dark:border-slate-600 p-2.5 hover:bg-slate-600 hover:text-white"
          onClick={() => setOpen(false)}
        >
          <CloseIcon className="h-4 w-4 dark:text-white " />
        </DialogDismiss>
      </div>
      {mounted ? children : null}
    </Dialog>
  );
};

export default Modal;
