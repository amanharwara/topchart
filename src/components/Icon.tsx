import { ComponentPropsWithoutRef } from "react";
import { Icons, IconType } from "../icons";

type Props = {
  icon: IconType;
} & ComponentPropsWithoutRef<"svg">;

const Icon = ({ icon, ...props }: Props) => {
  const IconComponent = Icons[icon];

  return <IconComponent aria-hidden="true" {...props} />;
};

export default Icon;
