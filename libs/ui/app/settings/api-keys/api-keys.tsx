import { ApiKey } from "@/models/models"

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import TableActions from "./api-key-actions"

export default function ApiKeysTable({
  profile,
  data,
}: {
  profile: any
  data: any
}) {
  const apiKeys = data.map((obj: any) => new ApiKey(obj))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Key</TableCell>
          <TableCell>Created At</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apiKeys?.map((apiKey: any) => {
          const { ...apiKeyObj } = apiKey
          return (
            <TableRow key={apiKey.id}>
              <TableCell>{apiKey.name}</TableCell>
              <TableCell>{apiKey.displayApiKey}</TableCell>
              <TableCell>
                {new Date(apiKey.createdAt).toLocaleDateString()}{" "}
              </TableCell>

              <TableCell className="text-right">
                <TableActions api_key={apiKeyObj} profile={profile} />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
