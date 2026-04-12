import { Badge } from '@/components/ui/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { learningResources, roles, type RoleId } from '@/data/mock'
import { BookOpen, Play, StickyNote } from 'lucide-react'
import { useMemo, useState } from 'react'

const kindIcon = {
  Video: Play,
  Course: BookOpen,
  Article: StickyNote,
}

export function LearningPage() {
  const [role, setRole] = useState<RoleId | 'all'>('all')

  const filtered = useMemo(() => {
    if (role === 'all') return learningResources
    return learningResources.filter((r) => r.roleIds.includes(role))
  }, [role])

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Learning resources"
        title="Curated library tied to roles and skills — not random playlists."
        description="Each resource lists duration, provider, and explicit skill tags so you can ladder into simulations with context."
      />

      <Card>
        <CardHeader>
          <CardTitle>Focus role</CardTitle>
          <CardDescription>Filter content mapped to career cards</CardDescription>
        </CardHeader>
        <div className="flex flex-wrap gap-2">
          <FilterPill active={role === 'all'} onClick={() => setRole('all')}>
            All
          </FilterPill>
          {roles.map((r) => (
            <FilterPill key={r.id} active={role === r.id} onClick={() => setRole(r.id)}>
              {r.title}
            </FilterPill>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        {filtered.map((res) => {
          const Icon = kindIcon[res.kind]
          return (
            <Card key={res.id} className="flex flex-col transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-brand-50 p-3 text-brand-700 dark:bg-brand-900 dark:text-sky-100">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <Badge tone="neutral" className="mb-2">
                    {res.kind}
                  </Badge>
                  <CardTitle className="text-lg leading-snug">{res.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {res.provider} · {res.duration}
                  </CardDescription>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {res.skills.map((s) => (
                  <Badge key={s} tone="brand">
                    {s}
                  </Badge>
                ))}
              </div>
              <a
                href={res.href}
                className="mt-5 inline-flex text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
              >
                Open resource (mock link) →
              </a>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white dark:bg-brand-500'
          : 'rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
      }
    >
      {children}
    </button>
  )
}
