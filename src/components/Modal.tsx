import { Dialog, DialogDismiss, DialogHeading, useDialogState } from "ariakit";
import { ReactNode } from "react";
import CloseIcon from "../icons/CloseIcon";

type Props = {
  title: string;
  isOpen: boolean;
  close: () => void;
  children: ReactNode;
};

const Modal = ({ title, isOpen, close, children }: Props) => {
  const state = useDialogState({
    open: isOpen,
  });

  return (
    <Dialog
      state={state}
      className="absolute top-1/2 left-1/2 flex max-h-[95vh] min-w-full -translate-y-1/2 -translate-x-1/2 flex-col rounded-sm bg-slate-700 text-white shadow sm:min-w-96"
    >
      <div className="flex w-full items-center border-b border-slate-600">
        <DialogHeading className="flex-grow px-3 text-sm font-semibold">
          {title}
        </DialogHeading>
        <DialogDismiss
          className="flex items-center border-l border-slate-600 p-2.5 hover:bg-slate-600"
          onClick={close}
        >
          <CloseIcon className="h-4 w-4 text-white" />
        </DialogDismiss>
      </div>
      {children}
    </Dialog>
  );
};

export default Modal;
