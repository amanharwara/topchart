import { ReactNode } from "react";
import CloseIcon from "../icons/CloseIcon";
import {
  Button,
  Dialog,
  DialogProps,
  DialogTrigger,
  Modal as RacModal,
} from "react-aria-components";
import classNames from "../utils/classNames";

type Props = {
  title: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
  isDismissable?: boolean;
} & DialogProps;

export function Modal({
  title,
  isOpen,
  setOpen,
  isDismissable = true,
  ...props
}: Props) {
  return (
    <DialogTrigger>
      <RacModal
        isDismissable={isDismissable}
        isOpen={isOpen}
        onOpenChange={setOpen}
      >
        <Dialog
          {...props}
          className={classNames(
            "absolute top-1/2 left-1/2 flex max-h-[calc(var(--viewport-height,_100vh)_-_2rem)] min-w-full -translate-y-1/2 -translate-x-1/2 flex-col rounded-sm dark:bg-slate-700 bg-slate-100 dark:text-white shadow sm:min-w-96 [&>*]:max-h-[85vh]",
            props.className
          )}
        >
          <div className="flex w-full items-center border-b border-gray-800 dark:border-slate-600">
            <div className="flex-grow px-3 text-sm font-semibold">{title}</div>
            <Button
              className="flex items-center border-l border-gray-800 dark:border-slate-600 p-2.5 enabled:hover:bg-slate-600 enabled:hover:text-white disabled:opacity-50"
              onPress={() => setOpen(false)}
              aria-label="Close dialog"
              isDisabled={!isDismissable}
            >
              <CloseIcon className="h-4 w-4 dark:text-white " />
            </Button>
          </div>
          {props.children}
        </Dialog>
      </RacModal>
    </DialogTrigger>
  );
}
