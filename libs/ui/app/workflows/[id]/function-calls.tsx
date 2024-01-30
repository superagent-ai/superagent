import React from "react"

interface FunctionCallsProps {
  functionCalls?: any[]
}

function FunctionCalls({ functionCalls }: FunctionCallsProps) {
  return (
    <div className="h-full space-y-4">
      <h3 className="text-primary/70">Run Logs</h3>

      {functionCalls?.map((call, index) => (
        <div key={index} className="flex flex-row items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          {call?.type == "function_call" && (
            <span className="font-mono text-sm font-normal text-muted-foreground">
              TOOL: {call.function}
            </span>
          )}

          {call?.type == "start" && (
            <span className="font-mono text-sm font-normal text-muted-foreground">
              INPUT
            </span>
          )}

          {call?.type == "end" && (
            <span className="font-mono text-sm font-normal text-muted-foreground">
              OUTPUT
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export default FunctionCalls
