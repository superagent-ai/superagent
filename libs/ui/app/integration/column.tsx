import React from "react"
import { RxNotionLogo, RxRowSpacing } from "react-icons/rx"

import { CardIntegration } from "./components/CardIntegration"

export const Column = () => {
  const handleClick = () => {
    console.log("hola")
  }
  return (
    <div className="flex flex-wrap gap-4">
      <CardIntegration
        eventClick={handleClick}
        title="Whatsapp Busines API"
        description="Conecta tus cuentas de Whatsapp a tus agentes de IA de chatsappAI. "
      >
        <RxRowSpacing className="text-4xl text-black" />
      </CardIntegration>
      <CardIntegration
        eventClick={handleClick}
        title="Messenger"
        description="Conecta tus cuentas de Whatsapp a tus agentes de IA de chatsappAI. "
      >
        <RxRowSpacing className="text-4xl text-black" />
      </CardIntegration>
      <CardIntegration
        eventClick={handleClick}
        title="Notion"
        description="Conecta tus cuentas de Whatsapp a tus agentes de IA de chatsappAI. "
      >
        <RxNotionLogo className="text-4xl text-black" />
      </CardIntegration>
      <CardIntegration
        eventClick={handleClick}
        title="Whatsapp Busines API"
        description="Conecta tus cuentas de Whatsapp a tus agentes de IA de chatsappAI. "
      >
        <RxRowSpacing className="text-4xl text-black" />
      </CardIntegration>
      <CardIntegration
        eventClick={handleClick}
        title="Whatsapp Busines API"
        description="Conecta tus cuentas de Whatsapp a tus agentes de IA de chatsappAI. "
      >
        <RxRowSpacing className="text-4xl text-black" />
      </CardIntegration>
      <CardIntegration
        eventClick={handleClick}
        title="Whatsapp Busines API"
        description="Conecta tus cuentas de Whatsapp a tus agentes de IA de chatsappAI. "
      >
        <RxRowSpacing className="text-4xl text-black" />
      </CardIntegration>
      <CardIntegration
        eventClick={handleClick}
        title="Whatsapp Busines API"
        description="Conecta tus cuentas de Whatsapp a tus agentes de IA de chatsappAI. "
      >
        <RxRowSpacing className="text-4xl text-black" />
      </CardIntegration>
      <CardIntegration
        eventClick={handleClick}
        title="Whatsapp Busines API"
        description="Conecta tus cuentas de Whatsapp a tus agentes de IA de chatsappAI. "
      >
        <RxRowSpacing className="text-4xl text-black" />
      </CardIntegration>
      <CardIntegration
        eventClick={handleClick}
        title="Whatsapp Busines API"
        description="Conecta tus cuentas de Whatsapp a tus agentes de IA de chatsappAI. "
      >
        <RxRowSpacing className="text-4xl text-black" />
      </CardIntegration>
    </div>
  )
}
