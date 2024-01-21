import IntegrationsClientPage from "./client-page"

export default function Integration() {
  return (
    <div className="flex h-screen flex-col justify-between space-y-0 overflow-hidden">
      <p className="px-6 py-5 font-medium">Integrations</p>
      <div className="flex grow overflow-auto">
        <IntegrationsClientPage />
      </div>
    </div>
  )
}
