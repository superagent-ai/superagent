import React from 'react'

interface Props{
  title: string,
  value: string | number
}

export const Title = ({title, value}: Props) => {
  return (
    <div className='flex flex-col gap-1'>
      <h2>{title}</h2>
      <p className='text-2xl font-bold'>{value}</p>
    </div>
  )
}
