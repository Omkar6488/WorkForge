import { Badge } from '@/components/ui/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { learningResources, roles, type RoleId } from '@/data/mock'
import { useAppStore } from '@/store/appStore'
import { BookOpen, Play, StickyNote } from 'lucide-react'
import { useMemo, useState } from 'react'

const kindIcon = {
  Video: Play,
  Course: BookOpen,
  Article: StickyNote,
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

export function LearningPage() {
  const [role, setRole] = useState<RoleId | 'all'>('all')

  // Get completion tracking from store
  const currentUser = useAppStore((s: any) => s.currentUser)
  const resourceCompletions = useAppStore((s: any) => s.resourceCompletions ?? [])
  const recordResourceCompletion = useAppStore((s: any) => s.recordResourceCompletion)

  // Get completed resources for current student
  const completedIds = useMemo(
    () => new Set(
      resourceCompletions
        .filter((c: any) => c.studentId === currentUser?.id)
        .map((c: any) => c.resourceId)
    ),
    [resourceCompletions, currentUser]
  )

  const filtered = useMemo(() => {
    if (role === 'all') return learningResources
    return learningResources.filter((r) => r.roleIds.includes(role))
  }, [role])

  const handleMarkComplete = (resourceId: string) => {
    if (currentUser) {
      recordResourceCompletion(currentUser.id, resourceId)
    }
  }

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
          const isCompleted = completedIds.has(res.id)
          return (
            <Card key={res.id} className={`flex flex-col transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)] ${isCompleted ? 'opacity-75' : ''}`}>
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-brand-50 p-3 text-brand-700 dark:bg-brand-900 dark:text-sky-100">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex gap-2 flex-wrap mb-2">
                    <Badge tone="neutral">
                      {res.kind}
                    </Badge>
                    {res.difficulty && (
                      <Badge tone={
                        res.difficulty === 'Beginner' ? 'success' :
                        res.difficulty === 'Intermediate' ? 'warning' :
                        'info'
                      }>
                        {res.difficulty}
                      </Badge>
                    )}
                    {isCompleted && <Badge tone="success">✓ Done</Badge>}
                  </div>
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
              <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <a
                  href={res.href}
                  className="inline-flex text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
                >
                  Open resource →
                </a>
                {!isCompleted && currentUser && (
                  <button
                    onClick={() => handleMarkComplete(res.id)}
                    className="inline-flex text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Mark complete
                  </button>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
