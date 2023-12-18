import { useRef, useState } from "react"
import Link from "next/link"
import { Agent } from "@/models/models"
import type { Identifier } from "dnd-core"
import { Check, ChevronsUpDown } from "lucide-react"
import { useDrag, useDrop } from "react-dnd"
import { RxPlus, RxTrash } from "react-icons/rx"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export const ItemTypes = {
  STEP: "step",
}

export interface Step {
  id: string
  agent?: Agent | null
}

interface StepProps {
  isLast?: boolean
  agents: Agent[]
  stepIndex: number
  step: Step
  selectAgent: (agent: Agent, stepIndex: number) => void
  unselectAgent: (stepIndex: number) => void
  addNewItem: (indexToAdd: number) => void
  removeItem: (indexToRemove: number) => void
  moveCard: (dragIndex: number, hoverIndex: number) => void
}

type SelectAgentButtonProps = StepProps

interface DragItem {
  index: number
  id: string
  type: string
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
      d="M 8,0 L 8,32 L 4,28 M 8,32 L 12,28"
      fill="none"
      className="stroke-gray-300 dark:stroke-gray-700"
    />
  </svg>
)
const SelectAgentButton: React.FC<SelectAgentButtonProps> = ({
  agents,
  step,
  stepIndex,
  moveCard,
  selectAgent,
  removeItem,
  unselectAgent,
}) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
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
    <div ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      <div className="flex">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {step?.agent?.name || "Select an agent"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              {agents?.length ? (
                <div>
                  <CommandInput placeholder="Search framework..." />
                  <CommandEmpty>No agents found.</CommandEmpty>
                  <CommandGroup>
                    {agents.map((agent) => (
                      <CommandItem
                        key={agent.id}
                        value={agent.name}
                        onSelect={(currentValue) => {
                          selectAgent(agent, stepIndex)
                          setValue(currentValue === value ? "" : currentValue)
                          if (currentValue === value) unselectAgent(stepIndex)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            step?.agent?.name === agent?.name
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {agent.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </div>
              ) : (
                <div className="flex flex-col items-center p-2">
                  <p className="mb-2">No agents found.</p>
                  <Link href="/agents?addNewAgentModal=true">
                    <Button variant="active">Create a new agent</Button>
                  </Link>
                </div>
              )}
            </Command>
          </PopoverContent>
        </Popover>

        <Button
          className="ml-2"
          variant="secondary"
          size="icon"
          onClick={() => removeItem(stepIndex)}
        >
          <RxTrash size="20px" />
        </Button>
      </div>
    </div>
  )
}

const Step: React.FC<StepProps> = ({ isLast, ...props }) => {
  return (
    <>
      <SelectAgentButton {...props} />
      <div className="flex flex-col items-center">
        <VerticalLine />
        <Button
          variant="outline"
          size="sm"
          title="Add a new agent"
          onClick={() => props.addNewItem(props.stepIndex + 1)}
        >
          <RxPlus />
        </Button>
        {!isLast && <VerticalLine />}
      </div>
    </>
  )
}

export default Step
