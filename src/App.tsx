import { useState } from 'react'
import { RegisterScreen, type Player } from './components/RegisterScreen'
import { QuizScreen, type Answer } from './components/QuizScreen'
import { ResultScreen } from './components/ResultScreen'
import { Telao } from './components/Telao'
import { completeAnswers, loadPlayed, savePlayed } from './lib/played'

type Stage =
  | { name: 'register' }
  | { name: 'quiz'; player: Player }
  | { name: 'result'; player: Player; answers: Answer[]; restored?: boolean }

function initialStage(): Stage {
  const played = loadPlayed()
  if (!played) return { name: 'register' }
  return { name: 'result', player: played.player, answers: completeAnswers(played.answers), restored: true }
}

function Game() {
  const [stage, setStage] = useState<Stage>(initialStage)

  function start(player: Player) {
    savePlayed({ player, answers: [] })
    setStage({ name: 'quiz', player })
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      {stage.name === 'register' && <RegisterScreen onStart={start} />}

      {stage.name === 'quiz' && (
        <QuizScreen
          onProgress={(answers) => savePlayed({ player: stage.player, answers })}
          onFinish={(answers) => setStage({ name: 'result', player: stage.player, answers })}
        />
      )}

      {stage.name === 'result' && (
        <ResultScreen player={stage.player} answers={stage.answers} restored={stage.restored} />
      )}
    </main>
  )
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '')
  return path === '/telao' ? <Telao /> : <Game />
}
