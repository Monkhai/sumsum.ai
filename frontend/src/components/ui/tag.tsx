import { type ReactNode } from "react";
import { Icon } from "@iconify-icon/react";

interface Props {
  children: ReactNode;
}
export default function Tag({ children }: Props) {
  return (
    <span className="flex items-center rounded-full bg-blue-400/80 px-2 py-1">
      <span className="text-xs font-light text-blue-100">{children}</span>
      <Icon icon="mdi-light:alert" />
    </span>
  );
}
