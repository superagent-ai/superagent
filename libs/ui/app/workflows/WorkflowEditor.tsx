"use client"

import React, { useCallback, useMemo, useRef, useState } from "react"
import { Agent } from "@/models/Agent"
import type { Identifier } from "dnd-core"
import update from "immutability-helper"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { v4 as uuid } from "uuid"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export const ItemTypes = {
  STEP: "step",
}

const VerticalLine = () => (
  <svg className="h-8 w-4">
    <path
      d="M 8,0 L 8,32"
      fill="none"
      className="stroke-gray-300 dark:stroke-gray-700"
    />
  </svg>
)
const ArrowDown = () => (
  <svg className="mb-4 h-8 w-4">
    <path
      d="M 8,0 L 8,32 L 6,30 M 8,32 L 10,30"
      fill="none"
      className="stroke-gray-300 dark:stroke-gray-700"
    />
  </svg>
)

interface StepProps {
  agents: Agent[]
  stepIndex: number
  itemIndex: number
  step: Step
  setActiveStepIndex: React.Dispatch<React.SetStateAction<number>>
  selectAgent: (agent: Agent) => void
  addNewItem: (indexToAdd: number) => void
  moveCard: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

const Step: React.FC<StepProps> = ({
  moveCard,
  step,
  stepIndex,
  addNewItem,
  selectAgent,
  setActiveStepIndex,
  agents,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.STEP,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    drop(item: DragItem) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = stepIndex

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.STEP,
    item: () => {
      return { id: step.id, index: stepIndex }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0.5 : 1
  drag(drop(ref))

  return (
    <Dialog>
      <div ref={ref} style={{ opacity }} data-handler-id={handlerId}>
        <DialogTrigger
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "mb-1"
          )}
          onClick={() => setActiveStepIndex(stepIndex)}
        >
          <div>
            {stepIndex + 1}. {step?.agent?.name ?? "Select agent"}
          </div>
        </DialogTrigger>
      </div>

      <div>
        <VerticalLine />
        <DialogTrigger
          className="hover:bg-primary my-2 flex h-4 w-4 items-center justify-center rounded-full text-sm text-gray-500 transition-colors duration-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-500"
          title="Add a new step"
          onClick={() => addNewItem(stepIndex + 1)}
        >
          +
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Agents</DialogTitle>
            <DialogDescription>Add a new agent to workflow</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 flex-wrap justify-between gap-2">
            {agents.map((agent) => (
              <DialogTrigger
                onClick={() => selectAgent(agent)}
                key={`agent-${agent.id}`}
              >
                {agent.name}
              </DialogTrigger>
            ))}
          </div>
        </DialogContent>
        <ArrowDown />
      </div>
    </Dialog>
  )
}

interface Step {
  id: string
  agent?: Agent
}

interface WorkflowEditorProps {
  data: any[]
}

const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ data }) => {
  // initalizing steps with one item
  const [steps, setSteps] = useState<Step[]>([
    {
      id: uuid(),
    },
  ])

  const [activeStepIndex, setActiveStepIndex] = useState(0)

  const agents = useMemo(
    () => data?.map((item) => new Agent(item)) || [],
    [data]
  )
  const addNewItem = useCallback((indexToAdd: number) => {
    const newItem = {
      id: uuid(),
    }

    setSteps((prevSteps) =>
      update(prevSteps, {
        $splice: [[indexToAdd, 0, newItem]],
      })
    )
    setActiveStepIndex(indexToAdd)
  }, [])

  const selectAgent = useCallback(
    (agent: Agent) => {
      setSteps((prevSteps) => {
        prevSteps[activeStepIndex] = {
          ...steps[activeStepIndex],
          agent,
        }
        return [...prevSteps]
      })
    },
    [activeStepIndex, steps]
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
          itemIndex={stepIndex}
          selectAgent={selectAgent}
          setActiveStepIndex={setActiveStepIndex}
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
