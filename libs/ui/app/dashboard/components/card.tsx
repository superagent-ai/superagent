"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { FaEyeSlash } from "react-icons/fa6"
import { IoEyeSharp } from "react-icons/io5"
import { useAsync, useSetState } from "react-use"

import { Profile } from "@/types/profile"
import { siteConfig } from "@/config/site"
import { Api } from "@/lib/api"
import { ApiChatwootPlatform } from "@/lib/api_chatwoot"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import { useChatwoot } from "@/app/context/ChatwootContext"

import { FormUserChatwoot } from "./FormUserChatwoot"
import { ProfileChatwoot } from "./ProfileChatwoot"

export const CardTable = ({ profile }: { profile: Profile }) => {
  const {
    token,
    handleChangeToken,
    userProfileChatwoot,
    tokenActive,
    handleChangeActiveToken,
  } = useChatwoot()
  console.log(tokenActive)
  const [modal, setModal] = useState(() => {
    return tokenActive ? true : false
  })
  const [visibilty, setVisibilty] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    description: "",
    llmModel: "GPT_3_5_TURBO_16K_0613",
    isActive: true,
    tools: [],
    datasources: [],
    prompt: "You are an helpful AI Assistant",
  })

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  })

  const api = useMemo(() => new Api(profile.api_key), [profile.api_key])

  const { value: llms = [] } = useAsync(async () => {
    const { data } = await api.getLLMs()
    return data
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

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
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)

    const apiChatwoot = new ApiChatwootPlatform()
    const mock = {
      name: user.name,
      email: user.email,
      password: user.password,
      type: "SuperAdmin",
      custom_attributes: {},
    }

    try {
      if (!tokenActive) {
        const response = await apiChatwoot.createUser(mock)

        if (response.confirmed) {
          //Create Agent SuperAgent
          let agent
          try {
            const agentResponse = await api.createAgent({ ...form })
            agent = agentResponse.data
            if (agent && llms.length > 0) {
              await api.createAgentLLM(agent.id, llms[0]?.id)
            }
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
          const initial_signal_apiAgent = agent.id.slice(0, 3)

          // Create an account for the agent in Chatwoot
          const accountDetails = {
            name: `Account for ${initial_signal_apiAgent}`,
          }
          const accountResponse =
            await apiChatwoot.createAccount(accountDetails)

          if (accountResponse && accountResponse.id) {
            // Send the created user as an administrator to the new account
            const adminUserDetails = {
              user_id: response.id,
              role: "administrator",
            }
            await apiChatwoot.createAccountUser(
              accountResponse.id,
              adminUserDetails
            )

            //Agent Bot Details
            const agent_bot_name = `t-${initial_signal_apiAgent}-bot`
            const agent_bot_description = "Agent Bot By SuperAgent"
            const agent_bot_url = `${process.env.NEXT_PUBLIC_CHATWOOT_API_URL}/webhook/${apiAgent}/chatwoot`

            //Create bot agent chatwoot
            const agentBotDetails = {
              name: agent_bot_name,
              description: agent_bot_description,
              outgoing_url: agent_bot_url,
              account_id: accountResponse.id,
            }
            let agentBotResponse
            try {
              agentBotResponse =
                await apiChatwoot.createAgentBot(agentBotDetails)
            } catch (error) {
              console.error("Failed to create agent bot:", error)
            }

            if (agentBotResponse && agentBotResponse.access_token) {
              const respToken = await api.createToken({
                apiUserChatwoot: accountResponse.id,
                userToken: response.access_token,
                agentToken: agentBotResponse.access_token,
              })

              if (respToken) {
                toast({
                  color: "green",
                  description: respToken.message,
                })
                handleChangeActiveToken(true)
                handleChangeToken(response.access_token)
                setModal(false)
                router.refresh()
                router.push(`/agents/${agent.id}`)
              }
            }
          }
        } else {
          throw new Error("Failed to create user in Chatwoot")
        }
      }
    } catch (error) {
      console.error("Failed to create user or agent:", error)
      toast({
        color: "red",
        description: "Failed to create user or agent",
      })
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
            <form
              onSubmit={onSubmit}
              className="border-1 flex flex-col gap-5 rounded-lg border border-white p-10"
            >
              {!tokenActive && modal && (
                <>
                  <label className="flex w-full flex-col gap-1">
                    <p>User name: </p>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          name: e.target.value,
                        })
                      }
                      className="w-full rounded-lg p-2"
                      placeholder="Eg: Revhouse"
                      required
                    />
                  </label>
                  <label className="flex w-full flex-col gap-1">
                    <p>Email: </p>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          email: e.target.value,
                        })
                      }
                      className="w-full rounded-lg p-2"
                      placeholder="Eg: chatwoot@revhouse.com"
                      required
                    />
                  </label>

                  <label className="flex w-full flex-col gap-1">
                    <p>Password</p>
                    <input
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          password: e.target.value,
                        })
                      }
                      className="w-full rounded-lg p-2"
                    />
                  </label>
                </>
              )}

              <div className="mt-10 flex flex-col gap-5">
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
                <button
                  disabled={loading}
                  className="rounded-lg border border-white p-2 transition-colors hover:bg-slate-700"
                  type="submit"
                >
                  {loading ? "Loading..." : "Create Agent with Chatwoot"}
                </button>
              </div>
            </form>
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
              className={`w-[170px] rounded-md p-2 transition-all${
                tokenActive ? "opacity-50" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {tokenActive
                ? "Ya estas conectado a un operador de Chatwoot"
                : "Conecta"}
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {userProfileChatwoot && (
          <ProfileChatwoot profile={userProfileChatwoot} />
        )}
      </div>
      <Toaster />
    </div>
  )
}
