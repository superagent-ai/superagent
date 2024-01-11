// Componente StepOne.jsx
import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"
import { ApiChatwootPlatform } from "@/lib/api_chatwoot"
import { toast } from "@/components/ui/use-toast"
import { useChatwoot } from "@/app/context/ChatwootContext"

interface StepOneProps {
  nextStep: () => void
  profile: Profile
}

const StepFive = ({ nextStep, profile }: StepOneProps) => {
  //Context
  const { userProfileChatwoot, agentToken, apiAgent, handleChangeActiveToken } = useChatwoot()

  //State
  const [loading, setLoading] = useState(false)
  const api = useMemo(() => new Api(profile.api_key), [profile.api_key])
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleFinish = async() => {
    try {
      setLoading(true)
      const respToken = await api.createToken({
        apiUserChatwoot: userProfileChatwoot?.id?.toString() || "",
        userToken: userProfileChatwoot?.access_token || "",
        agentToken: agentToken?.toString() || "",
      })

      if (respToken) {
        setSuccess(true)
        toast({
          color: "green",
          description: respToken.message,
        })
      }
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  const redirectAgent = () => {
    handleChangeActiveToken(true)
    router.refresh()
    router.push(`/agents/${apiAgent}`)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {success  && <>
        <h2>Creación Exitosa</h2>
        <button onClick={redirectAgent}>Ir al Agent</button>
      </>}
      <button disabled={success} onClick={handleFinish}>{loading ? 'Cargando...': 'Crear Cuenta en Chatwoot'}</button>
    </div>
  )
}

export default StepFive
