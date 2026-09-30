import { QUESTIONS, QUESTION_TIME_MS } from '../data/questions'
import type { Answer } from '../components/QuizScreen'
import type { Player } from '../components/RegisterScreen'

// Trava o aparelho após a primeira participação: quem recarrega a página
// volta para o próprio resultado em vez do cadastro.
const KEY = 'upper-quiz:played'

type Played = { player: Player; answers: Answer[] }

export function loadPlayed(): Played | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Played) : null
  } catch {
    return null
  }
}

export function savePlayed(played: Played) {
  try {
    localStorage.setItem(KEY, JSON.stringify(played))
  } catch {
    // navegador sem storage (ex.: modo privado restrito): segue sem trava local
  }
}

// Quem saiu no meio do quiz perde as perguntas restantes, como se o tempo tivesse esgotado.
export function completeAnswers(answers: Answer[]): Answer[] {
  const missing = QUESTIONS.slice(answers.length).map((_, i) => ({
    question: answers.length + i,
    choice: null,
    time_ms: QUESTION_TIME_MS,
    correct: false,
  }))
  return [...answers, ...missing]
}
