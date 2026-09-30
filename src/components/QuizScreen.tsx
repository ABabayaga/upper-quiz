import { useCallback, useEffect, useRef, useState } from 'react'
import { POINTS_PER_HIT, QUESTIONS, QUESTION_TIME_MS } from '../data/questions'
import { TruckRoute } from './TruckRoute'

export type Answer = { question: number; choice: number | null; time_ms: number; correct: boolean }

const FEEDBACK_MS = 900
const LETTERS = ['A', 'B', 'C', 'D']

export function QuizScreen({ onFinish }: { onFinish: (answers: Answer[]) => void }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [left, setLeft] = useState(QUESTION_TIME_MS)
  const [locked, setLocked] = useState<Answer | null>(null)

  const startedAt = useRef(0)
  const raf = useRef(0)

  const question = QUESTIONS[index]
  const hits = answers.filter((a) => a.correct).length

  const register = useCallback(
    (choice: number | null) => {
      if (locked) return
      cancelAnimationFrame(raf.current)
      const elapsed = Math.min(QUESTION_TIME_MS, Math.round(performance.now() - startedAt.current))
      const answer: Answer = {
        question: index,
        choice,
        time_ms: choice === null ? QUESTION_TIME_MS : elapsed,
        correct: choice === question.correct,
      }
      const next = [...answers, answer]
      setLocked(answer)
      setAnswers(next)

      window.setTimeout(() => {
        if (index + 1 >= QUESTIONS.length) return onFinish(next)
        setIndex(index + 1)
        setLocked(null)
      }, FEEDBACK_MS)
    },
    [answers, index, locked, onFinish, question.correct],
  )

  // cronômetro da pergunta atual
  useEffect(() => {
    startedAt.current = performance.now()
    setLeft(QUESTION_TIME_MS)

    const tick = () => {
      const remaining = QUESTION_TIME_MS - (performance.now() - startedAt.current)
      if (remaining <= 0) {
        setLeft(0)
        register(null)
        return
      }
      setLeft(remaining)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const seconds = Math.ceil(left / 1000)
  const urgent = seconds <= 3

  function optionClass(i: number) {
    const base = 'flex w-full items-center gap-4 rounded-xl border px-4 py-4 text-left font-medium transition'
    if (!locked) return `${base} border-line bg-panel-2 hover:border-upper hover:bg-upper/10 active:scale-[0.99]`
    if (i === question.correct) return `${base} border-good bg-good/15 text-good`
    if (i === locked.choice) return `${base} border-bad bg-bad/15 text-bad`
    return `${base} border-line bg-panel-2 opacity-50`
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-3xl border border-line bg-panel p-6 md:p-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-upper-2">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <p className="font-semibold">Pergunta {index + 1} de {QUESTIONS.length}</p>
              <p className="text-sm text-muted">Escolha uma alternativa</p>
            </div>
          </div>

          <div
            className="grid size-16 place-items-center rounded-full"
            style={{
              background: `conic-gradient(${urgent ? 'var(--color-bad)' : 'var(--color-upper-2)'} ${(left / QUESTION_TIME_MS) * 360}deg, var(--color-panel-2) 0deg)`,
            }}
          >
            <span className={`grid size-12 place-items-center rounded-full bg-panel text-xl font-black ${urgent ? 'text-bad' : ''}`}>
              {seconds}
            </span>
          </div>
        </div>

        <h2 className="mt-8 text-2xl font-bold leading-snug md:text-3xl">{question.q}</h2>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {question.a.map((option, i) => (
            <button key={option} type="button" disabled={!!locked} onClick={() => register(i)} className={optionClass(i)}>
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-ink text-sm font-bold">{LETTERS[i]}</span>
              {option}
            </button>
          ))}
        </div>

        <p className={`mt-5 text-sm ${locked ? (locked.correct ? 'text-good' : 'text-bad') : 'text-muted'}`}>
          {locked
            ? locked.correct ? `+${POINTS_PER_HIT} pontos!` : locked.choice === null ? 'Tempo esgotado.' : 'Resposta errada.'
            : 'O tempo está correndo.'}
        </p>
      </div>

      <TruckRoute hits={hits} total={QUESTIONS.length} points={hits * POINTS_PER_HIT} />
    </div>
  )
}