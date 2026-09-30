import { useState } from 'react'
import { RegisterScreen, type Player } from './components/RegisterScreen'
import { QuizScreen, type Answer } from './components/QuizScreen'
import { ResultScreen } from './components/ResultScreen'
import { Telao } from './components/Telao'

type Stage =
  | { name: 'register' }
  | { name: 'quiz'; player: Player }
  | { name: 'result'; player: Player; answers: Answer[] }

function Game() {
  const [stage, setStage] = useState<Stage>({ name: 'register' })

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      {stage.name === 'register' && (
        <RegisterScreen onStart={(player) => setStage({ name: 'quiz', player })} />
      )}

      {stage.name === 'quiz' && (
        <QuizScreen onFinish={(answers) => setStage({ name: 'result', player: stage.player, answers })} />
      )}

{stage.name === 'result' && (
  <ResultScreen
    player={stage.player}
    answers={stage.answers}
    onReset={() => setStage({ name: 'register' })}
  />
)}
    </main>
  )
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '')
  return path === '/telao' ? <Telao /> : <Game />
}