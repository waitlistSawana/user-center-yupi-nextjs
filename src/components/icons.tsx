import type { IconBaseProps } from "react-icons/lib";
import { LuGithub } from "react-icons/lu";
import { FaGoogle } from "react-icons/fa";

export const IconGithub = (props: IconBaseProps) => {
  return <LuGithub {...props} />;
};

export const IconGoogle = (props: IconBaseProps) => {
  return <FaGoogle {...props} />;
};
