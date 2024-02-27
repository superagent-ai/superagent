import { ApiKey } from "@/models/models"

import { Api } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import TableActions from "./api-key-actions"

const ApiKeysTable = async ({ profile }: { profile: any }) => {
  const api = new Api(profile?.api_key)

  let {
    data = [],
  }: {
    data: any[]
  } = await api.getApiKeys()

  const apiKeys = data.map((obj) => new ApiKey(obj))

  return (
    <Table>
      <TableCaption>A list of your API keys.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Key</TableCell>
          <TableCell>Created At</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apiKeys?.map((apiKey) => {
          const { ...apiKeyObj } = apiKey
          return (
            <TableRow key={apiKey.id}>
              <TableCell>{apiKey.name}</TableCell>
              <TableCell>{apiKey.displayApiKey}</TableCell>
              <TableCell>
                {new Date(apiKey.createdAt).toLocaleDateString()}{" "}
              </TableCell>

              <TableCell>
                <TableActions api_key={apiKeyObj} profile={profile} />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default ApiKeysTable
