import { Leaderboard } from './Leaderboard'

export function Telao() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">
      <header className="flex items-center justify-between">
        <img src="/logo_branca.png" alt="UPPER GR" className="h-12 w-auto" />
        <span className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold uppercase tracking-wider text-muted">
          <span className="size-2.5 animate-pulse rounded-full bg-good" />
          Ranking ao vivo
        </span>
      </header>

      <div className="flex flex-1 items-center py-8">
        <div className="w-full">
          <Leaderboard size="big" />
        </div>
      </div>
    </main>
  )
}