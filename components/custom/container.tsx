import { BaseProp } from "../props/base-prop";

interface ContainerProps extends BaseProp {}

export default function Container({
  children,
  visible = true,
  className,
}: ContainerProps) {
  if (!visible) return null;

  return (
    <div
      className={`max-w-screen py-3 px-6 grid grid-cols-1 gap-4 ${className}`}
    >
      {children}
    </div>
  );
}
