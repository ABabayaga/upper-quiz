import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { formatSeconds } from '../lib/format'
import { countResults, type ResultRow } from '../lib/supabase'

// QR code desativado por enquanto; mudar para true para exibir
const SHOW_QR = false

// ordem visual do pódio: 2º, 1º, 3º
const SLOTS = [
  { place: 1, height: 'h-[30vh]' },
  { place: 0, height: 'h-[40vh]' },
  { place: 2, height: 'h-[22vh]' },
]

export function Telao() {
  const { rows, error } = useLeaderboard(3)
  const [count, setCount] = useState<number | null>(null)

  // o contador acompanha cada atualização do ranking
  useEffect(() => {
    countResults().then(setCount).catch(() => {})
  }, [rows])

  return (
    <main className="grid h-screen grid-rows-[auto_1fr_auto] gap-6 overflow-hidden px-[4vw] py-[4vh]">
      <header className="flex items-start justify-between gap-8">
        <div>
          <img src="/logo_branca.png" alt="UPPER GR" className="h-14 w-auto" />
          <h1 className="mt-6 font-display text-7xl font-bold uppercase leading-none">Quanto você conhece a Upper?</h1>
        </div>
        <div className="text-right">
          <p key={count} className="animate-rise font-display text-8xl font-bold leading-none tabular-nums text-upper-2">
            {count ?? 0}
          </p>
          <p className="mt-2 text-3xl text-muted">{count === 1 ? 'participante' : 'participantes'}</p>
        </div>
      </header>

      <section className="grid grid-cols-3 items-end gap-[2vw]">
        {SLOTS.map(({ place, height }) => (
          <PodiumSlot key={place} place={place} row={rows[place]} height={height} />
        ))}
      </section>

      <footer className="flex items-end justify-between gap-8">
        <p className="text-2xl text-muted">
          {error ? <span className="text-bad">{error}</span> : 'Critério: mais acertos, depois menor tempo'}
        </p>
        {SHOW_QR && (<div className="flex items-center gap-6">
          <p className="max-w-[12ch] text-right font-display text-4xl font-semibold uppercase leading-tight">
            Aponte a câmera e jogue
          </p>
          <div className="rounded-lg bg-white p-3">
            <QRCodeSVG value={window.location.origin} size={168} bgColor="#ffffff" fgColor="#030405" />
          </div>
        </div>)}
      </footer>
    </main>
  )
}

function PodiumSlot({ place, row, height }: { place: number; row?: ResultRow; height: string }) {
  const first = place === 0

  return (
    <div className="flex min-w-0 flex-col">
      <div key={row?.id ?? 'vazio'} className="animate-rise mb-5 min-w-0 text-center">
        {row ? (
          <>
            <p className={`truncate font-display font-bold uppercase leading-none ${first ? 'text-7xl' : 'text-6xl'}`}>
              {row.name}
            </p>
            <p className={`mt-2 truncate font-medium text-upper-2 ${first ? 'text-4xl' : 'text-3xl'}`}>@{row.instagram}</p>
            <p className="mt-3 font-display text-5xl font-semibold leading-none tabular-nums">
              {row.score}/5 <span className="text-muted">·</span> {formatSeconds(row.time_ms)}
            </p>
          </>
        ) : (
          <p className="font-display text-5xl font-semibold uppercase text-muted/60">Aguardando</p>
        )}
      </div>

      <div
        className={`${height} flex items-start justify-center rounded-t-xl pt-[3vh] transition-[height] duration-700 ${
          first ? 'bg-upper/25' : 'bg-panel-2'
        }`}
      >
        <span className={`font-display font-bold leading-none tabular-nums text-upper-2 ${first ? 'text-[10rem]' : 'text-9xl'}`}>
          {place + 1}º
        </span>
      </div>
    </div>
  )
}
