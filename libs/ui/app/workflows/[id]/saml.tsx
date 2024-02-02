"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import * as yaml from "js-yaml"
import * as monaco from "monaco-editor"
import { useTheme } from "next-themes"
import { TbCommand } from "react-icons/tb"
import { useAsyncFn } from "react-use"

import { initialSamlValue } from "@/config/saml"
import { Api } from "@/lib/api"
import { Spinner } from "@/components/ui/spinner"

import { initMonaco } from "./editor"

function removeNullValues(obj: any) {
  const newObj: any = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (obj[key] === null) continue
    if (typeof obj[key] === "object") {
      newObj[key] = removeNullValues(obj[key])
    } else {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

export default function SAML({
  workflow,
  profile,
}: {
  workflow: any
  profile: any
}) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const latestWorkflowConfig = workflow.workflowConfigs.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0]
  const formattedConfig = removeNullValues(latestWorkflowConfig?.config)
  const workflowConfigsYaml = yaml.dump(formattedConfig, {
    lineWidth: -1,
  })

  const [{ loading: isSavingConfig }, saveConfig] = useAsyncFn(async () => {
    const { data: config } = await api.generateWorkflow(
      workflow.id,
      editor?.getValue()
    )
    router.refresh()
    return config
  }, [router, api])

  const { theme } = useTheme()
  const [editor, setEditor] =
    React.useState<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoEl = React.useRef(null)

  React.useEffect(() => {
    if (monacoEl && !editor) {
      initMonaco(
        monacoEl.current!,
        theme,
        formattedConfig ? workflowConfigsYaml : initialSamlValue
      ).then(setEditor)
    }

    editor?.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, saveConfig)
    return () => editor?.dispose()
  }, [monacoEl.current])

  return (
    <div className="relative h-full">
      <div className="flex space-x-2 border-b px-3 py-2">
        <p className="text-xs text-muted-foreground">
          Last update:{" "}
          {new Date(latestWorkflowConfig?.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      </div>
      <div className="h-full w-full" ref={monacoEl} />
      <div className="absolute bottom-4 flex w-full flex-col items-center justify-center space-y-4 px-6 pt-12">
        {isSavingConfig ? (
          <div className="flex items-center space-x-1 py-1 text-sm text-muted-foreground">
            <Spinner />
            <span>Saving...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Press</span>
            <code className="relative flex rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              <div className="flex items-center">
                <TbCommand />
                <span>S</span>
              </div>
            </code>
            <span>to save</span>
          </div>
        )}
      </div>
    </div>
  )
}
