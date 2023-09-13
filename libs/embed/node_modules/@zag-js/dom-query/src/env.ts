const isDocument = (el: any): el is Document => el.nodeType === Node.DOCUMENT_NODE

export function getDocument(el: Element | Node | Document | null) {
  if (isDocument(el)) return el
  return el?.ownerDocument ?? document
}

export function getWindow(el: HTMLElement) {
  return el?.ownerDocument.defaultView ?? window
}
