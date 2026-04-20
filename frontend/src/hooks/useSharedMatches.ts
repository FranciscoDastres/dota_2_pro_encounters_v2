import { useState, useCallback } from 'react'
import { fetchSharedMatches } from '../services/api'
import type { SharedMatch } from '../types'

interface State {
  data: SharedMatch[] | null
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
}

export function useSharedMatches(accountId: number, proAccountId: number) {
  const [state, setState] = useState<State>({ data: null, status: 'idle', error: null })

  const load = useCallback(async () => {
    if (state.status === 'loading') return
    setState({ data: null, status: 'loading', error: null })
    try {
      const res = await fetchSharedMatches(accountId, proAccountId)
      setState({ data: res.matches, status: 'success', error: null })
    } catch (err) {
      setState({
        data: null,
        status: 'error',
        error: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  }, [accountId, proAccountId, state.status])

  return { ...state, load }
}
