import loader from "@monaco-editor/loader"
import { configureMonacoYaml } from "monaco-yaml"

import { yamlJsonSchema } from "@/config/saml"

window.MonacoEnvironment = {
  getWorker(_, label) {
    switch (label) {
      case "editorWorkerService":
        return new Worker(
          new URL("monaco-editor/esm/vs/editor/editor.worker", import.meta.url)
        )
      case "yaml":
        return new Worker(new URL("monaco-yaml/yaml.worker", import.meta.url))
      default:
        throw new Error(`Unknown label ${label}`)
    }
  },
}

export async function initMonaco(
  wrapperEl: HTMLElement,
  theme: string = "light",
  initialValue: string
) {
  return loader.init().then((monaco) => {
    configureMonacoYaml(monaco, {
      enableSchemaRequest: false,
      schemas: [
        {
          fileMatch: ["*"],
          uri: "http://example.com/schema-name.json",
          schema: yamlJsonSchema,
        },
      ],
    })

    const modelUri = monaco.Uri.parse("config.yaml")
    const model = monaco.editor.getModel(modelUri)

    if (!model) {
      monaco.editor.createModel(initialValue, "yaml", modelUri)
    }

    return monaco.editor.create(wrapperEl, {
      automaticLayout: true,
      model,
      scrollbar: {
        vertical: "hidden",
      },
      fontSize: 14,
      theme: theme === "dark" ? "vs-dark" : "vs-light",
      quickSuggestions: {
        other: true,
        comments: false,
        strings: true,
      },
      minimap: { enabled: false },
    })
  })
}
