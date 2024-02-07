interface AssistantsLayoutProps {
  children: React.ReactNode
  params: { slug: string }
}

export default async function AssistantsLayout({
  params,
  children,
}: AssistantsLayoutProps) {
  return (
    <div className="flex h-screen flex-col justify-between space-y-0 overflow-hidden">
      <div className="flex grow">{children}</div>
    </div>
  )
}
