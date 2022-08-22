import { ComponentPropsWithoutRef, ComponentType } from "react";

type Props = {
  icon: ComponentType<ComponentPropsWithoutRef<"svg">>;
} & ComponentPropsWithoutRef<"input">;

const InputWithIcon = ({ icon: Icon, ...props }: Props) => (
  <div className="flex flex-grow rounded border border-slate-600">
    <div className="flex items-center border-r border-slate-600 px-2.5 py-2">
      {<Icon className="h-4 w-4" />}
    </div>
    <input
      className="flex-grow bg-transparent px-2.5 py-2 text-sm placeholder:text-slate-400"
      {...props}
    />
  </div>
);

export default InputWithIcon;
