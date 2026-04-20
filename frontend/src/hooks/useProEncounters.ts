import { useState, useCallback } from 'react'
import { fetchProEncounters } from '../services/api'
import type { ProEncountersResponse, SearchStatus } from '../types'

interface State {
  data: ProEncountersResponse | null
  status: SearchStatus
  error: string | null
}

interface UseProEncountersReturn extends State {
  search: (steamId: string) => Promise<void>
  reset: () => void
}

const INITIAL_STATE: State = { data: null, status: 'idle', error: null }

export function useProEncounters(): UseProEncountersReturn {
  const [state, setState] = useState<State>(INITIAL_STATE)

  const search = useCallback(async (steamId: string) => {
    setState({ data: null, status: 'loading', error: null })
    try {
      const data = await fetchProEncounters(steamId)
      setState({ data, status: 'success', error: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setState({ data: null, status: 'error', error: message })
    }
  }, [])

  const reset = useCallback(() => setState(INITIAL_STATE), [])

  return { ...state, search, reset }
}
