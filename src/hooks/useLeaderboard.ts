import { useCallback, useEffect, useState } from 'react'
import { fetchTop, supabase, type ResultRow } from '../lib/supabase'

export function useLeaderboard(limit = 3) {
  const [rows, setRows] = useState<ResultRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setRows(await fetchTop(limit))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar ranking')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    refresh()
    const channel = supabase
      .channel('results-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'results' }, () => refresh())
      .subscribe()
    const poll = window.setInterval(refresh, 15_000)

    return () => {
      window.clearInterval(poll)
      supabase.removeChannel(channel)
    }
  }, [refresh])

  return { rows, loading, error }
}