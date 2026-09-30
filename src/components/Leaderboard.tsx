import { useLeaderboard } from '../hooks/useLeaderboard'
import { formatSeconds } from '../lib/format'

const PLACES = ['1º', '2º', '3º']

type Props = { size?: 'normal' | 'big'; highlight?: string }

export function Leaderboard({ size = 'normal', highlight }: Props) {
  const { rows, loading, error } = useLeaderboard(3)
  const big = size === 'big'

  return (
    <div className={`rounded-xl bg-panel-2 ${big ? 'p-8 md:p-12' : 'p-5'}`}>
      <h3 className={`font-display font-bold uppercase ${big ? 'text-4xl md:text-6xl' : 'text-xl'}`}>Top 3</h3>

      {error && <p className="mt-4 text-sm text-bad">{error}</p>}
      {loading && <p className="mt-4 text-sm text-muted">carregando ranking...</p>}
      {!loading && !error && rows.length === 0 && <p className="mt-4 text-sm text-muted">Aguardando participantes.</p>}

      <ol className={`flex flex-col ${big ? 'mt-8 gap-5' : 'mt-4 gap-2'}`}>
        {rows.map((r, i) => (
          <li
            key={r.id}
            className={`flex items-center gap-4 rounded-lg ${big ? 'p-6' : 'p-3'} ${
              r.instagram === highlight ? 'bg-upper/15 ring-1 ring-upper' : 'bg-ink/60'
            }`}
          >
            <span className={`font-display font-bold tabular-nums text-upper-2 ${big ? 'text-6xl' : 'text-3xl'}`}>{PLACES[i]}</span>
            <div className="min-w-0 flex-1">
              <p className={`truncate font-semibold ${big ? 'text-3xl md:text-4xl' : ''}`}>{r.name}</p>
              <p className={`truncate text-upper-2 ${big ? 'text-xl' : 'text-sm'}`}>@{r.instagram}</p>
            </div>
            <div className="text-right">
              <p className={`font-display font-bold tabular-nums ${big ? 'text-4xl md:text-5xl' : 'text-xl'}`}>{r.score}/5</p>
              <p className={`tabular-nums text-muted ${big ? 'text-lg' : 'text-xs'}`}>{formatSeconds(r.time_ms)}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className={`text-muted ${big ? 'mt-8 text-lg' : 'mt-4 text-xs'}`}>Critério: mais acertos, depois menor tempo</p>
    </div>
  )
}