type Ctx = { getRootNode?: () => Document | ShadowRoot | Node }

const getDocument = (node: Document | ShadowRoot | Node) => {
  if (node.nodeType === Node.DOCUMENT_NODE) return node as Document
  return node.ownerDocument ?? document
}

export function createScope<T>(methods: T) {
  const screen = {
    getRootNode: (ctx: Ctx) => (ctx.getRootNode?.() ?? document) as Document | ShadowRoot,
    getDoc: (ctx: Ctx) => getDocument(screen.getRootNode(ctx)),
    getWin: (ctx: Ctx) => screen.getDoc(ctx).defaultView ?? window,
    getActiveElement: (ctx: Ctx) => screen.getDoc(ctx).activeElement as HTMLElement | null,
    getById: <T extends HTMLElement = HTMLElement>(ctx: Ctx, id: string) =>
      screen.getRootNode(ctx).getElementById(id) as T | null,
    queryById: <T extends HTMLElement = HTMLElement>(ctx: Ctx, id: string): T => {
      const el = screen.getById<T>(ctx, id)
      if (!el) throw new Error(`Element with id "${id}" not found.`)
      return el
    },
  }
  return { ...screen, ...methods }
}
