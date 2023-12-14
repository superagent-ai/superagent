"use client"

import React, { useCallback, useMemo, useState } from "react"
import { Agent } from "@/models/Agent"
import update from "immutability-helper"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { v4 as uuid } from "uuid"

import Step, { type Step as StepType } from "./Step"

interface WorkflowEditorProps {
  data: any[]
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ data }) => {
  // initalizing steps with one item
  const [steps, setSteps] = useState<StepType[]>([
    {
      id: uuid(),
    },
  ])

  const agents = useMemo(
    () => data?.map((item) => new Agent(item)) || [],
    [data]
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

  return (
    <DndProvider backend={HTML5Backend}>
      {steps.map((step, stepIndex: number) => (
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
