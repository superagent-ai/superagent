// Componente StepOne.jsx
import React, { useState } from "react"

import { ApiChatwootPlatform } from "@/lib/api_chatwoot"
import { useChatwoot } from "@/app/context/ChatwootContext"

interface StepOneProps {
  nextStep: () => void
}

const StepOne = ({ nextStep }: StepOneProps) => {
  //Context
  const {
    handleProfileChatwoot
  } = useChatwoot()

  //State
  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  })

  //Function
  const handleAddUserChatwoot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const apiChatwoot = new ApiChatwootPlatform()
      const mock = {
        name: user.name,
        email: user.email,
        password: user.password,
        type: "SuperAdmin",
        custom_attributes: {},
      }
      const response = await apiChatwoot.createUser(mock)

      if (response.confirmed) {
        handleProfileChatwoot(response)
        nextStep()
      }

      throw new Error("No se ha podido crear el usuario.")
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
        <button
          type="submit"
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
          disabled={loading}
        >
          {loading ? "Cargando Usuario..." : "Crear Usuario"}
        </button>
      </form>
    </div>
  )
}

export default StepOne
