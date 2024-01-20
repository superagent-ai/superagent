"use client"

import Link from "next/link"

import { Title } from "./Title"
import { Resolutions } from "./Resolutions"

interface DataTableProps<TData> {
  data: TData[]
}
export const Dashboard = <TData extends {}>({
  data,
}: DataTableProps<TData>) => {
  return (
    <div className="flex flex-col gap-9 p-5">
      <div className="flex flex-col gap-5">
        <h2 className="text-xl">Panel de control</h2>
        <h2 className="text-3xl">Bienvenido a ChatsappAI</h2>
      </div>
      <div className="flex flex-wrap gap-9 rounded-lg border-2 p-5">
        <Title title="Mensajes Recibidos" value="1982" />
        <Title title="Mensajes Enviados" value="1982" />
        <Title title="Conversaciones" value="1982" />
        <Title title="Dinero Ahorrado" value="1982" />
        <Title title="Resoluciones" value="1982" />
        <Title title="Usuarios unicos" value="1982" />
        <Title title="Tiempo Ahorrado" value="1982" />
        <Title title="Derivaciones a humanos" value="1982" />
        <Title title="Miembros del Equipo" value="1982" />
        <Title title="Agentes de IA" value={data.length} />
      </div>
      <div className="flex items-center justify-center gap-5">
        <Link
          className="rounded-lg bg-white px-4 py-2 text-black"
          href="agents"
        >
          ▶ Agentes de IA
        </Link>
        <Link
          className="rounded-lg bg-white px-4 py-2 text-black"
          href="datasource"
        >
          ℹ️ ️Bases de Datos
        </Link>
        <Link className="rounded-lg bg-white px-4 py-2 text-black" href="faqs">
          ❓ FAQs
        </Link>
        <Link className="rounded-lg bg-white px-4 py-2 text-black" href="">
          🔦 Funciones
        </Link>
        <Link className="rounded-lg bg-white px-4 py-2 text-black" href="">
          📞 ️Conexiones
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border-2 p-7">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl">Resolutions</h2>
            <p className="text-gray-400">
              Entiende que tan satisfechos estan tus clientes con las
              respuestas.
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-4">
            <Resolutions title="Confirmed Resolutions" value={0} color="bg-green-500"/>
            <Resolutions title="Assumed Resolutions" value={0} color="bg-yellow-500"/>
            <Resolutions title="No Resolutions" value={0} color="bg-red-500"/>
            <Resolutions title="Unclear" value={0} color="bg-gray-500"/>

          </div>
        </div>
        <div className="rounded-lg border-2 p-7">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl">Problemas mas comunes</h2>
            <p className="text-gray-400">
              Aqui algunos de los problemas mas comunes.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-xs text-gray-400">Keywords</h2>
            <h2 className="text-xs text-gray-400">Mentions</h2>
          </div>
        </div>
      </div>
    </div>
  )
}
