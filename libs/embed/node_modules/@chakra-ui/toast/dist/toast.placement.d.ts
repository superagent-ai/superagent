type LogicalToastPosition = "top-start" | "top-end" | "bottom-start" | "bottom-end";
type ToastPositionWithLogical = LogicalToastPosition | "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right";
type ToastPosition = Exclude<ToastPositionWithLogical, LogicalToastPosition>;
declare function getToastPlacement(position: ToastPosition | undefined, dir: "ltr" | "rtl"): ToastPosition | undefined;

export { LogicalToastPosition, ToastPosition, ToastPositionWithLogical, getToastPlacement };
