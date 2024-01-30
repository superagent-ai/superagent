import React from "react"
import { RxCursorArrow } from "react-icons/rx"

interface Props {
  children?: React.ReactNode
  title: string
  description: string
  eventClick: () => void
}

export const CardIntegration = ({
  children,
  title,
  description,
  eventClick,
}: Props) => {
  return (
    <div className="flex flex-col justify-evenly gap-3 rounded-2xl bg-white p-4 md:col-span-3 md:h-[212px] md:w-[272px] lg:col-span-3 xl:col-span-2">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {children}
          <h2 className="text-xl text-black">{title}</h2>
        </div>
        <p className="text-md text-gray-600">{description}</p>
      </div>
      <div className="flex justify-center">
        <button
          onClick={eventClick}
          className="flex items-center justify-center gap-2 rounded-md bg-black px-4 py-2"
        >
          <RxCursorArrow />
          <span>Conectar</span>
        </button>
      </div>
    </div>
  )
}
