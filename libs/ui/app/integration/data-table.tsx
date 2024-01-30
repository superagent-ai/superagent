"use client"

import React from "react"

import { Profile } from "@/types/profile"
import { Column } from "./column"

interface Props {
  profile: Profile
}

export function DataTable({ profile }: Props) {

  return (
    <>
      <Column/>
    </>
  )
}
