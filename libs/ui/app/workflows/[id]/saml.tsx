"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import * as yaml from "js-yaml"
import * as monaco from "monaco-editor"
import { useTheme } from "next-themes"
import { TbCommand } from "react-icons/tb"

import { exampleConfigs } from "@/config/saml"
import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

import { initCodeEditor } from "./editor"

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
  const { toast } = useToast()

  const router = useRouter()
  const latestWorkflowConfig = workflow.workflowConfigs.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0]
  const formattedConfig = removeNullValues(latestWorkflowConfig?.config)
  const workflowConfigsYaml = yaml.dump(formattedConfig, {
    lineWidth: -1,
  })

  const [isSavingConfig, setSavingConfig] = useState(false)

  const { resolvedTheme } = useTheme()
  const codeEditorRef = useRef(null)

  let editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    if (codeEditorRef.current) {
      editorRef.current = initCodeEditor(codeEditorRef.current, resolvedTheme)
    }

    return () => {
      editorRef.current?.dispose()
    }
  }, [])

  const saveConfig = useCallback(async () => {
    const api = new Api(profile.api_key)
    if (isSavingConfig) return
    setSavingConfig(true)

    const res = await api.generateWorkflow(
      workflow.id,
      editorRef?.current?.getValue()
    )

    const data = await res.json()

    if (!res.ok) {
      const error = data?.error
      toast({
        title: "Something went wrong!",
        description: error?.message,
      })
    } else {
      router.refresh()
      toast({
        title: "Config saved!",
      })
    }
    setSavingConfig(false)
  }, [isSavingConfig, workflow.id, router, toast, profile.api_key])

  useEffect(() => {
    editorRef?.current?.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      saveConfig
    )
  }, [isSavingConfig, saveConfig])

  useEffect(() => {
    editorRef?.current?.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      saveConfig
    )
  }, [isSavingConfig, saveConfig])

  useEffect(() => {
    editorRef?.current?.setValue(workflowConfigsYaml)
  }, [workflowConfigsYaml])

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
      <div className="h-full w-full" ref={codeEditorRef} />
      <div className="absolute bottom-4 flex w-full flex-col items-center justify-center space-y-4">
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              editorRef?.current?.setValue(exampleConfigs.browserYaml)
            }
          >
            Browser
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => editorRef?.current?.setValue(exampleConfigs.ragYaml)}
          >
            Documents
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              editorRef?.current?.setValue(exampleConfigs.multiAssistantYaml)
            }
          >
            Multi-agent
          </Button>
        </div>

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
      <Toaster />
    </div>
  )
}
