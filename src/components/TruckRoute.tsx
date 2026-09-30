type Props = { hits: number; total: number; points: number }

export function TruckRoute({ hits, total, points }: Props) {
  const progress = total ? hits / total : 0

  return (
    <div className="rounded-2xl border border-line bg-panel-2 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">Rota de acertos</p>
          <p className="font-semibold">Faça o caminhão chegar ao destino</p>
        </div>
        <p className="shrink-0 text-2xl font-black text-upper-2">
          {points} <span className="text-sm font-semibold text-muted">pts</span>
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span className="text-xs text-muted">Partida</span>
        <div className="relative flex h-3 flex-1 gap-1">
          {Array.from({ length: total }, (_, i) => (
            <div key={i} className={`h-full flex-1 rounded-full transition-colors duration-500 ${i < hits ? 'bg-good' : 'bg-ink'}`} />
          ))}
          <div
            className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-[70%] text-2xl transition-[left] duration-500"
            style={{ left: `${progress * 100}%` }}
          >
            <span className="inline-block -scale-x-100">🚚</span>
          </div>
        </div>
        <span className="text-xs font-semibold text-good">Destino</span>
      </div>
    </div>
  )
}