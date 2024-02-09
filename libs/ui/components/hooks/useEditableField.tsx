import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

type ModeStatus = "view" | "edit"

export const useEditableField = (
  initalValue: string,
  // onUpdate function's argument types should infer from the passed function
  onUpdate: (value: string) => Promise<void>
) => {
  const [value, setValue] = useState<string>(initalValue)
  const [mode, setMode] = useState<ModeStatus>("view")
  const [isLoading, setLoading] = useState<boolean>(false)

  return mode === "view" ? (
    <p className="py-1 text-2xl hover:bg-muted" onClick={() => setMode("edit")}>
      {value}
    </p>
  ) : (
    <div className="flex items-center justify-between space-x-2">
      <Input
        value={value}
        onChangeCapture={(event: React.ChangeEvent<HTMLInputElement>) =>
          setValue(event.target.value)
        }
        placeholder="My Worflow"
        className="leading-0 flex-1 border-none p-0 text-2xl ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button
        size="sm"
        variant="secondary"
        className="h-8 py-0"
        onClick={async () => {
          setLoading(true)
          await onUpdate(value)
          setLoading(false)
          setMode("view")
        }}
      >
        {isLoading ? <Spinner /> : "Save"}
      </Button>
    </div>
  )
}
