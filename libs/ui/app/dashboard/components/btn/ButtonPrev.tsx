import React from 'react'

interface Props {
  title: string;
  prevStep: () => void;
}

export const ButtonPrev: React.FC<Props> = ({ title, prevStep }) => {
  return (
    <button
      onClick={prevStep}
      className="rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {title}
    </button>
  )
}
