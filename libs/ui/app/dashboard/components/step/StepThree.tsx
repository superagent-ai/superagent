// Componente StepOne.jsx
import React, { useMemo, useState } from "react"
import { useAsync } from "react-use"

import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { useChatwoot } from "@/app/context/ChatwootContext"
import { ButtonPrev } from "../btn/ButtonPrev"

interface StepOneProps {
  nextStep: () => void
  prevStep: () => void
  profile: Profile
}

const StepThree = ({ nextStep, prevStep, profile }: StepOneProps) => {
  //State
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
    llmModel: "GPT_3_5_TURBO_16K_0613",
    isActive: true,
    tools: [],
    datasources: [],
    prompt: "You are an helpful AI Assistant",
  })

  //Context
  const { handleAgentApi } = useChatwoot()


  //API
  const api = useMemo(() => new Api(profile.api_key), [profile.api_key])


  //Function
  const handleAddUserChatwoot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      //Create Agent SuperAgent
      let agent
      try {
        const agentResponse = await api.createAgent({ ...form })
        agent = agentResponse.data
      } catch (error: any) {
        if (error.response && error.response.status === 500) {
          console.error(
            "Agent creation encountered an error but may still have been created:",
            error
          )
        } else {
          throw error
        }
      }
      const apiAgent = agent.id

      if (agent && agent.id) {

        handleAgentApi(apiAgent)
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
      <h2 className="mb-4 text-lg font-bold">Paso 3: Creación de Agente SuperAgent</h2>
      <form onSubmit={handleAddUserChatwoot}>
        <label className="flex w-full flex-col gap-1">
          <p>Agent Name</p>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full rounded-lg p-2"
            placeholder="Eg: Agent Chatwoot"
            required
          />
        </label>
        <label className="flex w-full flex-col gap-1">
          <p>Description</p>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className="w-full rounded-lg p-2"
            placeholder="Eg: Chatwoot Description"
            required
          />
        </label>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Crear Agent SuperAgent"}
          </button>
          <ButtonPrev title="Previo" prevStep={prevStep}/>
        </div>
      </form>
    </div>
  )
}

export default StepThree
