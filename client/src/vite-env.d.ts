/// <reference types="vite/client" />

declare module "*.svg?react" {
  import React from "react";
  const SVGComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default SVGComponent;
}

declare module "lucide-react";
declare module "compression";
declare module "recharts" {
  export type LegendProps = any;
  const content: any;
  export default content;
  export const ResponsiveContainer: any;
  export const Tooltip: any;
  export const Legend: any;
}
declare module "vaul";
declare module "react-resizable-panels";
