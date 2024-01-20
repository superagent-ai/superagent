"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import {
  TbFile,
  TbFileTypeCsv,
  TbFileTypeDocx,
  TbFileTypePdf,
  TbFileTypePpt,
  TbFileTypeTxt,
  TbFileTypeXls,
  TbTrash,
} from "react-icons/tb"

import { Api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import NonIdealState from "@/components/non-ideal-state"

import AddDatsourceModal from "./add-datasource-modal"

interface Datasource {
  datasource: {
    name: string
    id: string
    createdAt: string
    type: string
    url: string
  }
}

function DatasourceIcon({ type }: { type: string }) {
  switch (type) {
    case "PDF":
      return <TbFileTypePdf size={20} className="text-red-500" />
    case "CSV":
      return <TbFileTypeCsv size={20} className="text-green-500" />
    case "XLSX":
      return <TbFileTypeXls size={20} className="text-green-500" />
    case "TXT":
      return <TbFileTypeTxt size={20} className="text-gray-500" />
    case "DOCX":
      return <TbFileTypeDocx size={20} className="text-blue-500" />
    case "PPTX":
      return <TbFileTypePpt size={20} className="text-orange-500" />
    default:
      return <TbFileTypeTxt size={20} className="text-gray-500" />
  }
}

export default function Datasources({
  agent,
  profile,
}: {
  agent: any
  profile: any
}) {
  const api = new Api(profile.api_key)
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<string | null>()
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-x-4 py-4">
        <span>Datasources</span>
        <div className="flex items-center space-x-2">
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter by name..."
                className="min-w-[200px] pl-10 lg:min-w-[350px]"
              />
            </div>
          </div>
          <AddDatsourceModal profile={profile} agent={agent} />
        </div>
      </CardHeader>
      <CardContent>
        {agent.datasources.map(({ datasource }: Datasource) => {
          return (
            <div className="flex items-center justify-between border-t py-3">
              <div className="flex space-x-4">
                <DatasourceIcon type={datasource.type} />
                <p>{datasource.name}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  setIsLoading(datasource.id)
                  await api.deleteAgentDatasource(agent.id, datasource.id)
                  router.refresh()
                  setIsLoading(null)
                }}
              >
                {isLoading === datasource.id ? (
                  <Spinner />
                ) : (
                  <TbTrash size={20} />
                )}
              </Button>
            </div>
          )
        })}
        {agent.datasources.length === 0 && (
          <NonIdealState
            icon={TbFile}
            title="No datasources found"
            description="This assistant doesn't seem to have any datasources attached to it"
          />
        )}
      </CardContent>
    </Card>
  )
}
