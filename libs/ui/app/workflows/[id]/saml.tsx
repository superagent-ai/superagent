"use client"

import * as React from "react"
import { LanguageSupport, StreamLanguage } from "@codemirror/language"
import * as yamlMode from "@codemirror/legacy-modes/mode/yaml"
import { githubLight } from "@uiw/codemirror-theme-github"
import CodeMirror from "@uiw/react-codemirror"

import { Button } from "@/components/ui/button"

const langYaml = new LanguageSupport(StreamLanguage.define(yamlMode.yaml))
const initialValue =
  "# 👋 Welcome! Orchestrate your worflows using yaml below.\n# More info in our docs: https://docs.superagent.sh\n\nworkflow:\n  "

export default function Saml() {
  const [value, setValue] = React.useState<string>(initialValue)
  const onChange = React.useCallback((val: string) => {
    setValue(val)
  }, [])

  return (
    <div className="relative flex-[40%] flex-col border-l">
      <div className="flex items-center justify-between border-b py-1 pl-2 pr-6">
        <div className="flex space-x-0 p-1">
          <p className="font-mono text-xs text-muted-foreground">
            superagent.yml
          </p>
        </div>
      </div>
      <CodeMirror
        theme={githubLight}
        value={value}
        onChange={onChange}
        extensions={[langYaml]}
        height="100%"
        indentWithTab={true}
        style={{
          border: "none",
          outline: "none",
          height: "100%",
        }}
      />
      <div className="absolute bottom-4 flex w-full items-center justify-end space-x-4 px-6 py-12">
        <p className="text-xs text-muted-foreground">
          Last update: {new Date().toLocaleString()}
        </p>
        <Button size="sm">Save</Button>
      </div>
    </div>
  )
}
