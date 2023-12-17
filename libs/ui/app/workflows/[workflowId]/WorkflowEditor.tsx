"use client"

import React, { useCallback, useMemo, useState } from "react"
import { Agent } from "@/models/Agent"
import { Workflow, WorkflowStep } from "@/models/models"
import update from "immutability-helper"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { v4 as uuid } from "uuid"

import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

import Step, { type Step as StepType } from "./Step"

interface WorkflowEditorProps {
  agentsData: any[]
  workflowStepsData: any[]
  workflowData: any
  api_key: string
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({
  api_key,
  agentsData,
  workflowData,
  workflowStepsData,
}) => {
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

  const [steps, setSteps] = useState<StepType[]>(
    workflowSteps?.length
      ? workflowSteps
      : [
          {
            // initalizing steps with one empty step
            id: uuid(),
          },
        ]
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
    const { data: currentWorkflowStepsData }: { data: any[] } =
      await api.getWorkflowSteps(workflow.id)
    const currentWorkflowSteps = currentWorkflowStepsData.map(
      (item: any) => new WorkflowStep(item)
    )

    for (const step of steps) {
      const currentStepInDb = currentWorkflowSteps.find(
        (s) => s?.agent?.id === step?.agent?.id
      )
      const currentStepIndex = steps.findIndex(
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

    toast({
      description: "Saved workflow",
    })
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex w-full items-center">
        <p className="mr-3">{workflow?.name}</p>
        <Button onClick={saveWorkflow} variant="active">
          Save
        </Button>
      </div>
      {steps?.map((step, stepIndex: number) => (
        <Step
          key={`workflow-step-${step.id}`}
          agents={agents}
          selectAgent={selectAgent}
          addNewItem={addNewItem}
          moveCard={moveCard}
          stepIndex={stepIndex}
          step={step}
        />
      ))}
    </DndProvider>
  )
}

export default WorkflowEditor
