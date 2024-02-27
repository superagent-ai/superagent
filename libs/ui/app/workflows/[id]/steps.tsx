import React from "react"

interface FunctionCall {
  type: StepType
  function?: string
}

export interface StepsViewProps {
  steps?: {
    [key: string]: FunctionCall[]
  }
}

export enum StepType {
  START = "start",
  END = "end",
  FUNCTION_CALL = "function_call",
}

interface StepProps {
  title: string
}

const Step = ({ title }: StepProps) => {
  return (
    <div className="flex flex-row items-center">
      <div className="mr-1 h-2 w-2 rounded-full bg-green-500"></div>
      <div className="flex-1 truncate">
        <span className="font-mono text-sm font-normal text-muted-foreground">
          {title}
        </span>
      </div>
    </div>
  )
}

function StepsView({ steps = {} }: StepsViewProps) {
  const hasSteps = Object.keys(steps).length > 0

  const startSteps = Object.entries(steps).filter(
    ([, functionCalls]) =>
      functionCalls.filter((call) => call.type === StepType.START).length > 0
  )

  const endSteps = Object.entries(steps).filter(
    ([, functionCalls]) =>
      functionCalls.filter((call) => call.type === StepType.END).length > 0
  )

  return (
    <div className="space-y-4">
      <h3 className="text-primary/70">Run Logs</h3>

      {startSteps && <Step title="INPUT" />}

      {hasSteps &&
        Object.entries(steps).map(([stepName, functionCalls]) => {
          const filteredFunctionCalls = functionCalls?.filter(
            (call) => call.type === StepType.FUNCTION_CALL
          )

          if (!filteredFunctionCalls?.length) return null
          return (
            <div key={stepName}>
              <h4 className="mb-1 text-primary/70">{stepName}:</h4>

              <div className="space-y-1 pl-4">
                {filteredFunctionCalls?.map(
                  (call, index) =>
                    call?.type === StepType.FUNCTION_CALL && (
                      <Step key={index} title={`TOOL: ${call.function}`} />
                    )
                )}
              </div>
            </div>
          )
        })}

      {endSteps && <Step title="OUTPUT" />}
    </div>
  )
}

export default StepsView
