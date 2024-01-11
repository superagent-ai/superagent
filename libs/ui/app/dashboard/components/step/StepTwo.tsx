// Componente StepOne.jsx
import React, { useState } from "react"

import { ApiChatwootPlatform } from "@/lib/api_chatwoot"
import { useChatwoot } from "@/app/context/ChatwootContext"

interface StepOneProps {
  nextStep: () => void
  prevStep: () => void
}

const StepTwo = ({ nextStep, prevStep }: StepOneProps) => {
  //Context
  const { userProfileChatwoot } = useChatwoot()

  //State
  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState("")
  const apiChatwoot = new ApiChatwootPlatform()

  //Function
  const handleAddUserChatwoot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const accountDetails = {
        name: account,
      }
      const accountResponse = await apiChatwoot.createAccount(accountDetails)
      if (accountResponse && accountResponse.id) {
        const adminUserDetails = {
          user_id: userProfileChatwoot?.id?.toString() || '',
          role: "administrator",
        }
        await apiChatwoot.createAccountUser(
          accountResponse.id,
          adminUserDetails
        )
        nextStep()
        return
      } else {
        throw new Error("Fallo en la creación de la cuenta.")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="mb-4 text-lg font-bold">Paso 1: Información Básica</h2>
      <form onSubmit={handleAddUserChatwoot}>
        <label className="flex w-full flex-col gap-1">
          <p>Account: </p>
          <input
            type="text"
            name="name"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="w-full rounded-lg p-2"
            placeholder="Eg: Account Company"
            required
          />
        </label>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
            disabled={loading}
          >
            {loading ? "Cargando Usuario..." : "Crear Usuario"}
          </button>
          <button onClick={prevStep}>Previo</button>
        </div>
      </form>
    </div>
  )
}

export default StepTwo
