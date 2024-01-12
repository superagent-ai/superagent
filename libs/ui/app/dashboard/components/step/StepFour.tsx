// Componente StepOne.jsx
import React, { useState } from "react"

import { ApiChatwootPlatform } from "@/lib/api_chatwoot"
import { useChatwoot } from "@/app/context/ChatwootContext"
import { ButtonPrev } from "../btn/ButtonPrev"

interface StepOneProps {
  nextStep: () => void
  prevStep: () => void
}

const StepFour = ({ nextStep, prevStep }: StepOneProps) => {
  //Context
  const { userProfileChatwoot, apiAgent, accountId, handleTokenChange } = useChatwoot()

  //State
  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState("")
  const apiChatwoot = new ApiChatwootPlatform()

  //Function
  const handleAddUserChatwoot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      //Agent Bot Details
      const agent_bot_name = account
      const agent_bot_description = "Agent Bot By SuperAgent"
      const agent_bot_url = `${process.env.NEXT_PUBLIC_SUPERAGENT_API_URL}/webhook/${apiAgent}/chatwoot`

      //Create bot agent chatwoot
      const agentBotDetails = {
        name: agent_bot_name,
        description: agent_bot_description,
        outgoing_url: agent_bot_url,
        account_id: accountId,
      }
      const agentBotResponse =
        await apiChatwoot.createAgentBot(agentBotDetails)

      if (agentBotResponse) {
        handleTokenChange(agentBotResponse.access_token)
        nextStep()
        return
      }

      throw new Error("Fallo en la creación de la cuenta.")
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="mb-4 text-lg font-bold">Paso 4: Creación de Agente Bot (Chatwoot)</h2>
      <form onSubmit={handleAddUserChatwoot}>
        <label className="flex w-full flex-col gap-1">
          <p>Agent Bot Name: </p>
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
            {loading ? "Cargando..." : "Crear Agente Bot"}
          </button>
          <ButtonPrev title="Previo" prevStep={prevStep}/>
        </div>
      </form>
    </div>
  )
}

export default StepFour
