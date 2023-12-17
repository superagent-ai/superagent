"use client"

import React, { useCallback, useMemo, useState } from "react"
import { Agent, Workflow, WorkflowStep } from "@/models/models"
import update from "immutability-helper"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { v4 as uuid } from "uuid"

import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/use-toast"

import Step, { type Step as StepType } from "./workflow-step"

interface WorkflowEditorProps {
  agentsData: any[]
  workflowStepsData: any[]
  workflowData: any
  api_key: string
}

const initialItem = {
  // initalizing steps with one empty step
  id: uuid(),
  agent: null,
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
  api_key,
  agentsData,
  workflowData,
  workflowStepsData,
}) => {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const api = new Api(api_key)
  const workflow = new Workflow(workflowData)

  const agents = useMemo(
    () => agentsData?.map((item) => new Agent(item)) || [],
    [agentsData]
  )

  const workflowSteps = useMemo(
    () => workflowStepsData.map((item) => new WorkflowStep(item)),
    [workflowStepsData]
  )

  const initialStepsState = useMemo(
    () => (workflowSteps?.length ? workflowSteps : [initialItem]),
    [workflowSteps]
  )

  const [steps, setSteps] = useState<StepType[]>(initialStepsState)

  const [savedSteps, setSavedSteps] = useState<StepType[]>(
    workflowSteps?.length ? workflowSteps : [initialItem]
  )

  const addNewItem = useCallback(
    (indexToAdd: number) =>
      setSteps((prevSteps) =>
        update(prevSteps, {
          $splice: [
            [
              indexToAdd,
              0,
              {
                id: uuid(), // new item
              },
            ],
          ],
        })
      ),
    []
  )

  const selectAgent = useCallback(
    (agent: Agent, stepIndex: number) => {
      setSteps((prevSteps) => {
        prevSteps[stepIndex] = {
          ...steps[stepIndex],
          agent,
        }
        return [...prevSteps]
      })
    },
    [steps]
  )

  const unselectAgent = useCallback(
    (stepIndex: number) => {
      setSteps((prevSteps) => {
        prevSteps[stepIndex] = {
          ...steps[stepIndex],
          agent: null,
        }
        return [...prevSteps]
      })
    },
    [steps]
  )

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setSteps((prevSteps) =>
      update(prevSteps, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevSteps[dragIndex]],
        ],
      })
    )
  }, [])

  const { toast } = useToast()

  const saveWorkflow = async () => {
    setIsSaving(true)
    const { data: currentWorkflowStepsData }: { data: any[] } =
      await api.getWorkflowSteps(workflow.id)
    const currentWorkflowSteps = currentWorkflowStepsData.map(
      (item: any) => new WorkflowStep(item)
    )

    // filter steps if they dont have agent id
    const filteredSteps = steps.filter((step) => step?.agent?.id)

    if (filteredSteps?.length < 2) {
      setIsSaving(false)
      return toast({
        description: "You need at least 2 steps",
        variant: "destructive",
      })
    }

    for (const step of filteredSteps) {
      const currentStepInDb = currentWorkflowSteps.find(
        (s) => s?.agent?.id === step?.agent?.id
      )
      const currentStepIndex = filteredSteps.findIndex(
        (s) => s?.agent?.id === step?.agent?.id
      )

      if (!currentStepInDb) {
        await api.createWorkflowStep(workflow.id, {
          order: currentStepIndex,
          agentId: step?.agent?.id,
        })
      } else if (currentStepInDb.order != currentStepIndex) {
        await api.patchWorkflowStep(workflow.id, step?.id, {
          order: currentStepIndex,
          agentId: step?.agent?.id,
        })
      }
    }

    setSavedSteps(steps)
    setIsSaving(false)
    toast({
      description: "Saved workflow",
    })
  }

  return (
    <ScrollArea className="flex-1 border-r p-2 ">
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col items-center space-y-10 px-3">
          <div className="flex w-full items-center justify-between">
            <p className="mr-3">{workflow?.name}</p>
            <Button
              disabled={JSON.stringify(steps) === JSON.stringify(savedSteps)}
              onClick={saveWorkflow}
            >
              {isSaving ? <Spinner /> : "Save"}
            </Button>
          </div>
          <div>
            {steps?.map((step, stepIndex: number) => (
              <Step
                key={`workflow-step-${step.id}`}
                agents={agents}
                selectAgent={selectAgent}
                unselectAgent={unselectAgent}
                addNewItem={addNewItem}
                moveCard={moveCard}
                stepIndex={stepIndex}
                step={step}
                isLast={stepIndex === steps.length - 1}
              />
            ))}
          </div>
        </div>
      </DndProvider>
    </ScrollArea>
  )
}

export default WorkflowEditor
