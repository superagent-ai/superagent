"use client"

import * as React from "react"
import { LanguageSupport, StreamLanguage } from "@codemirror/language"
import * as yamlMode from "@codemirror/legacy-modes/mode/yaml"
import { githubLight } from "@uiw/codemirror-theme-github"
import CodeMirror from "@uiw/react-codemirror"
import * as yaml from "js-yaml"

import { Button } from "@/components/ui/button"

const langYaml = new LanguageSupport(StreamLanguage.define(yamlMode.yaml))
const initialValue =
  "# 👋 Welcome! Create your worflows using yaml below.\n# More info in our docs: https://docs.superagent.sh"

export default function Saml({
  workflow,
  profile,
}: {
  workflow: any
  profile: any
}) {
  const latestWorkflowConfig = workflow.workflowConfigs.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0]
  const workflowConfigsYaml = yaml.dump(latestWorkflowConfig.config, {
    lineWidth: -1,
  })
  const [value, setValue] = React.useState<string>(
    `${initialValue}\n\n${workflowConfigsYaml}`
  )
  const onChange = React.useCallback((val: string) => {
    setValue(val)
  }, [])

  return (
    <div className="relative h-full flex-[40%] flex-col">
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
          Last update:{" "}
          {new Date(workflow.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
        <Button size="sm">Save</Button>
      </div>
    </div>
  )
}
