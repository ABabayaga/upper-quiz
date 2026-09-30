import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error('Faltam VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env')
}

export const supabase = createClient(url, anonKey)

export type ResultRow = {
  id: string
  name: string
  instagram: string
  score: number
  points: number
  time_ms: number
  created_at: string
}

export type NewResult = {
    name: string
    instagram: string
    score: number
    points: number
    time_ms: number
    answers: { question: number; choice: number | null; time_ms: number }[]
  }
  
  export class DuplicateInstagramError extends Error {}
  
  export async function saveResult(result: NewResult) {
    const { error } = await supabase.from('results').insert(result)
    if (error) {
      // 23505 = unique violation (o @ já jogou)
      if (error.code === '23505') throw new DuplicateInstagramError()
      throw error
    }
  }
  
  export async function fetchTop(limit = 3): Promise<ResultRow[]> {
    const { data, error } = await supabase
      .from('results')
      .select('id,name,instagram,score,points,time_ms,created_at')
      .order('score', { ascending: false })
      .order('time_ms', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(limit)
    if (error) throw error
    return data ?? []
  }

  export async function instagramExists(instagram: string) {
    const { data, error } = await supabase
      .from('results')
      .select('id')
      .eq('instagram', instagram)
      .limit(1)
    if (error) throw error
    return (data?.length ?? 0) > 0
  }