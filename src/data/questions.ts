export type Question = { q: string; a: string[]; correct: number }

export const QUESTION_TIME_MS = 10_000
export const POINTS_PER_HIT = 100

export const QUESTIONS: Question[] = [
  { q: 'Há quantos anos a Upper GR é certificada ISO 9001?',
    a: ['10 anos', '12 anos', '14 anos', '20 anos'], correct: 2 },
  { q: 'Em até quanto tempo a FARO entrega uma pesquisa cadastral completa?',
    a: ['1 minuto', '10 minutos', '1 hora', '24 horas'], correct: 0 },
  { q: 'Qual checklist da Upper GR é feito 100% por inteligência artificial, sem interação do motorista?',
    a: ['Checklist Fast', 'Checklist Premium', 'Checklist Point', 'Checklist Express'], correct: 2 },
  { q: 'Em qual horário a Gestão de Pernoite monitora a movimentação dos veículos?',
    a: ['20h às 4h', '22h às 5h', '23h às 6h', '0h às 6h'], correct: 1 },
  { q: 'Qual é o app que conecta o motorista à transportadora durante toda a viagem?',
    a: ['RepenseTrack', 'Motora Match', 'Game Truck', 'RepenseLog'], correct: 0 },
]