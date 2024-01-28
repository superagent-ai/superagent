import { TbBrain } from "react-icons/tb"

export default async function Agents() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center space-y-8">
      <TbBrain size={45} />
      <div className="flex flex-col items-center space-y-1">
        <p className="text-sm font-medium">No assistant selected</p>
        <p className="text-sm text-muted-foreground">
          View details about an assistant by navigating the list to the left
        </p>
      </div>
    </div>
  )
}
