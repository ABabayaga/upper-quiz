import { useLeaderboard } from '../hooks/useLeaderboard'
import { formatSeconds } from '../lib/format'

const MEDALS = ['🥇', '🥈', '🥉']

type Props = { size?: 'normal' | 'big'; highlight?: string }

export function Leaderboard({ size = 'normal', highlight }: Props) {
  const { rows, loading, error } = useLeaderboard(3)
  const big = size === 'big'

  return (
    <div className={`rounded-2xl border border-line bg-panel-2 ${big ? 'p-8 md:p-12' : 'p-5'}`}>
      <h3 className={`font-black ${big ? 'text-4xl md:text-6xl' : 'text-xl'}`}>🏆 Top 3</h3>

      {error && <p className="mt-4 text-sm text-bad">{error}</p>}
      {loading && <p className="mt-4 text-sm text-muted">carregando ranking...</p>}
      {!loading && !error && rows.length === 0 && <p className="mt-4 text-sm text-muted">Aguardando participantes.</p>}

      <ol className={`flex flex-col ${big ? 'mt-8 gap-5' : 'mt-4 gap-2'}`}>
        {rows.map((r, i) => (
          <li
            key={r.id}
            className={`flex items-center gap-4 rounded-xl border ${big ? 'p-6' : 'p-3'} ${
              r.instagram === highlight ? 'border-upper bg-upper/15' : 'border-line bg-ink/60'
            }`}
          >
            <span className={big ? 'text-6xl' : 'text-2xl'}>{MEDALS[i]}</span>
            <div className="min-w-0 flex-1">
              <p className={`truncate font-bold ${big ? 'text-3xl md:text-4xl' : ''}`}>{r.name}</p>
              <p className={`truncate text-upper-2 ${big ? 'text-xl' : 'text-sm'}`}>@{r.instagram}</p>
            </div>
            <div className="text-right">
              <p className={`font-black ${big ? 'text-3xl md:text-4xl' : ''}`}>{r.score}/5</p>
              <p className={`text-muted ${big ? 'text-lg' : 'text-xs'}`}>{formatSeconds(r.time_ms)}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className={`text-muted ${big ? 'mt-8 text-lg' : 'mt-4 text-xs'}`}>Critério: mais acertos → menor tempo</p>
    </div>
  )
}