import { BaseProp } from "../props/base-prop";

interface ContainerProps extends BaseProp {}

export default function Container({
  children,
  visible,
  className,
}: ContainerProps) {
  if (!visible) return null;

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${className}`}
    >
      {children}
    </div>
  );
}
