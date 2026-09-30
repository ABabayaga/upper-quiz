import { TruckIcon } from './TruckIcon'

type Props = { hits: number; total: number; points: number }

const TRUCK_W = 52

export function TruckRoute({ hits, total, points }: Props) {
  const progress = total ? hits / total : 0
  const arrived = total > 0 && hits >= total

  return (
    <div className="rounded-xl bg-panel-2 p-4 md:p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold uppercase leading-none">Rota de acertos</p>
          <p className="mt-1 text-sm text-muted">Cada acerto avança um trecho.</p>
        </div>
        <p className="shrink-0 font-display text-3xl font-bold leading-none tabular-nums text-upper-2">
          {points} <span className="text-base font-semibold text-muted">pts</span>
        </p>
      </div>

      <div className="relative mt-4 flex h-24 overflow-hidden rounded-lg bg-ink">
        {/* trechos KM 1 a KM 5 */}
        <div className="relative flex flex-1">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`relative flex-1 transition-colors duration-500 ${i < hits ? 'bg-upper/12' : ''} ${
                i > 0 ? 'shadow-[inset_1px_0_0_rgb(255_255_255/0.06)]' : ''
              }`}
            >
              <span
                className={`absolute bottom-1.5 left-2 font-display text-sm font-semibold tabular-nums transition-colors duration-500 ${
                  i < hits ? 'text-upper-2' : 'text-muted/70'
                }`}
              >
                KM {i + 1}
              </span>
            </div>
          ))}

          {/* faixa central tracejada */}
          <div
            className="pointer-events-none absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2"
            style={{ background: 'repeating-linear-gradient(90deg, rgb(255 255 255 / 0.35) 0 14px, transparent 14px 26px)' }}
          />

          <div
            className="pointer-events-none absolute top-[calc(50%-4px)] -translate-y-full transition-[left] duration-700 ease-out"
            // a frente do caminhão para no fim do último trecho concluído
            style={{ left: `max(0px, calc(${progress} * 100% - ${TRUCK_W}px))`, width: TRUCK_W }}
          >
            <TruckIcon className="h-auto w-full" />
          </div>
        </div>

        {/* chegada */}
        <div className="flex w-5 shrink-0 flex-col">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="grid flex-1 grid-cols-2">
              <span className={i % 2 ? 'bg-text/80' : ''} />
              <span className={i % 2 ? '' : 'bg-text/80'} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex justify-between text-xs font-medium">
        <span className="text-muted">Partida</span>
        <span className={arrived ? 'text-good' : 'text-muted'}>Destino</span>
      </div>
    </div>
  )
}
