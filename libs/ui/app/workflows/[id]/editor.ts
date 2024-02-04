import loader from "@monaco-editor/loader"
import * as monaco from "monaco-editor"
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
let model = monaco.editor.createModel("initialValue", "yaml", modelUri)

export function initCodeEditor(
  wrapperElement: HTMLElement,
  theme: string = "light"
) {
  return monaco.editor.create(wrapperElement, {
    automaticLayout: true,
    model,
    scrollbar: {
      vertical: "hidden",
    },
    fontSize: 14,
    theme: theme === "dark" ? "github-dark" : "github-light",
    quickSuggestions: {
      other: true,
      comments: false,
      strings: true,
    },
    minimap: { enabled: false },
  })
}
