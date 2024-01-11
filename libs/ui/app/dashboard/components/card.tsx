"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { FaEyeSlash } from "react-icons/fa6"
import { IoEyeSharp } from "react-icons/io5"
import { useAsync, useSetState } from "react-use"

import { Profile } from "@/types/profile"
import { Api } from "@/lib/api"

import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import { useChatwoot } from "@/app/context/ChatwootContext"

import { FormUserChatwoot } from "./FormUserChatwoot"
import { ProfileChatwoot } from "./ProfileChatwoot"
import { ApiChatwootPlatform } from "@/lib/api_chatwoot"
import { siteConfig } from "@/config/site"
import StepOne from "./step/StepOne"
import StepTwo from "./step/StepTwo"
import StepThree from "./step/StepThree"
import StepFour from "./step/StepFour"
import StepFive from "./step/StepFive"

export const CardTable = ({ profile }: { profile: Profile }) => {
  const { token, handleChangeToken, userProfileChatwoot, tokenActive, handleChangeActiveToken } = useChatwoot()
  const [modal, setModal] = useState(() => {
    return tokenActive ? true : false
  })
  const [visibilty, setVisibilty] = useState(false)
  const [loading, setLoading] = useState(false)

  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  };
  const prevStep = () => setCurrentStep(currentStep - 1);


  const api = useMemo(() => new Api(profile.api_key), [profile.api_key])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.patchToken({
        userToken: token,
      })
      toast({
        color: "green",
        description: response.message,
      })
    } catch (error) {
      console.error("Failed to create token:", error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="flex flex-col space-y-4 px-4 py-6">
      <div className="container flex flex-col gap-7 md:w-[600px]">
        {tokenActive && (
          <form
            onSubmit={handleSubmit}
            className="flex items-end justify-between gap-6"
          >
            <label className="flex w-full flex-col gap-1">
              <p>Add Token Profile</p>
              <div className="relative">
                <input
                  type={visibilty ? "text" : "password"}
                  value={token}
                  onChange={(e) => handleChangeToken(e.target.value)}
                  className="w-full rounded-lg p-2"
                  placeholder="Token Chatwoot profile"
                  maxLength={50}
                />
                <button
                  type="button"
                  onClick={() => setVisibilty(!visibilty)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {visibilty ? <FaEyeSlash /> : <IoEyeSharp />}
                </button>
              </div>
            </label>
            <button className="w-[150px] rounded-lg bg-green-600 p-2">
              {loading ? "Update Token" : "Save Token"}
            </button>
          </form>
        )}

        {!tokenActive && modal && (
          <div className="pt-8">
            <h2 className="mb-2 text-2xl">Create User in Chatwoot</h2>
            <div
              className="border-1 flex flex-col gap-5 rounded-lg border border-white p-10"
            >
              {currentStep === 1 && <StepOne nextStep={nextStep} />}
              {currentStep === 2 && <StepTwo nextStep={nextStep} prevStep={prevStep} />}
              {currentStep === 3 && <StepThree nextStep={nextStep} prevStep={prevStep} profile={profile}/>}
              {currentStep === 4 && <StepFour nextStep={nextStep} prevStep={prevStep} />}
              {currentStep === 5 && <StepFive nextStep={prevStep} profile={profile} />}
            </div>
          </div>
        )}
        {(!modal || tokenActive) && (
          <div className="flex w-[100%] items-center justify-between gap-5 rounded-md bg-gray-800 px-4 md:h-[170px]">
            <div className="flex flex-col gap-2 ">
              <h2 className="text-2xl font-bold">
                Cuenta comercial de WhatsApp
              </h2>
              <p className="text-sm">
                Conecta un número comercial de WhatsApp a tu bot.
              </p>
            </div>
            <button
              disabled={tokenActive}
              onClick={() => setModal(() => !modal)}
              className={`w-[170px] rounded-md p-2 transition-all${tokenActive ? 'opacity-50' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {tokenActive ? "Ya estas conectado a un operador de Chatwoot" : "Conecta"}
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {userProfileChatwoot && <ProfileChatwoot profile={userProfileChatwoot} />}
      </div>
      <Toaster />
    </div>
  )
}
