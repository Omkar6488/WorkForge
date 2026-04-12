import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg py-16">
      <Card>
        <CardHeader>
          <CardTitle>404 — This route is not mapped</CardTitle>
          <CardDescription>
            The WorkForge shell only knows about the employability sections in the sidebar.
          </CardDescription>
        </CardHeader>
        <Button to="/">Return home</Button>
      </Card>
    </div>
  )
}
