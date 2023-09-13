export function isHTMLElement(value: any): value is HTMLElement {
  return typeof value === "object" && value?.nodeType === Node.ELEMENT_NODE && typeof value?.nodeName === "string"
}
