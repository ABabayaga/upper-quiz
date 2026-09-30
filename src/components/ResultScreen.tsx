import { useEffect, useRef, useState } from 'react'
import { POINTS_PER_HIT, QUESTIONS } from '../data/questions'
import { formatSeconds } from '../lib/format'
import { DuplicateInstagramError, saveResult } from '../lib/supabase'
import { Leaderboard } from './Leaderboard'
import type { Answer } from './QuizScreen'
import type { Player } from './RegisterScreen'

type Props = { player: Player; answers: Answer[]; onReset: () => void }
type Status = 'saving' | 'saved' | 'duplicate' | 'error'

export function ResultScreen({ player, answers, onReset }: Props) {
  const score = answers.filter((a) => a.correct).length
  const points = score * POINTS_PER_HIT
  const timeMs = answers.reduce((sum, a) => sum + a.time_ms, 0)

  const [status, setStatus] = useState<Status>('saving')
  const [errorMsg, setErrorMsg] = useState('')
  const sent = useRef(false)

  async function send() {
    setStatus('saving')
    try {
      await saveResult({
        name: player.name,
        instagram: player.instagram,
        score,
        points,
        time_ms: timeMs,
        answers: answers.map(({ question, choice, time_ms }) => ({ question, choice, time_ms })),
      })
      setStatus('saved')
    } catch (e) {
      if (e instanceof DuplicateInstagramError) return setStatus('duplicate')
      setErrorMsg(e instanceof Error ? e.message : 'Falha ao enviar')
      setStatus('error')
    }
  }

  // o StrictMode roda efeitos 2x em dev; o ref garante um único envio
  useEffect(() => {
    if (sent.current) return
    sent.current = true
    send()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="grid gap-5 md:grid-cols-[1.2fr_1fr]">
      <section className="rounded-3xl border border-line bg-panel p-7 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-upper-2">Desafio concluído</p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">
          {status === 'duplicate' ? 'Você já participou.' : 'Resultado registrado.'}
        </h1>

        <p className="mt-2 text-muted">
          {status === 'saving' && 'Enviando seu resultado...'}
          {status === 'saved' && 'Seu desempenho já entrou na disputa.'}
          {status === 'duplicate' && `O @${player.instagram} já tem uma participação registrada. Vale a primeira tentativa.`}
          {status === 'error' && <span className="text-bad">Não foi possível enviar: {errorMsg}</span>}
        </p>
        {status === 'error' && (
          <button onClick={send} className="mt-3 rounded-lg border border-bad px-4 py-2 text-sm font-semibold text-bad">
            Tentar novamente
          </button>
        )}

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            ['Acertos', `${score}/${QUESTIONS.length}`],
            ['Pontos', String(points)],
            ['Tempo', formatSeconds(timeMs)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-line bg-panel-2 p-4">
              <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
              <p className="mt-1 text-xl font-black md:text-2xl">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button onClick={onReset} className="rounded-xl bg-upper px-5 py-3 font-bold text-ink transition hover:bg-upper-2">
            NOVO PARTICIPANTE
          </button>
          <a href="https://www.instagram.com/grupoupper/" target="_blank" rel="noreferrer" className="font-semibold text-upper-2 hover:underline">
            @grupoupper ↗
          </a>
        </div>
      </section>

      <Leaderboard highlight={player.instagram} />
    </div>
  )
}