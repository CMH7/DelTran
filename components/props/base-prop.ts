export interface BaseProp extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  visible?: boolean;
}
