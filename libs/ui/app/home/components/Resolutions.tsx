import React from 'react'

interface ResolutionsProps {
  title: string,
  value: string | number,
  color: string // Color for the bar
}

export const Resolutions = ({ title, value, color }: ResolutionsProps) => {
  return (
    <div className='flex'>
      <div className={`w-1 ${color}`}></div>
      <div className='flex flex-col justify-center pl-4'>
        <h2>{title}</h2>
        <p>{value}%</p>
      </div>
    </div>
  )
}
