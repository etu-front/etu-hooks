import { useState, useReducer, useEffect, Dispatch } from 'react'

interface State<T = any> {
  data: T
  error?: any
  loading: boolean
  loaded: boolean
}
interface Action {
  type: string
  payload?: {
    data?: any
    error?: any
  }
}

function reducer<T>(state: State<T>, action: Action): State<T> {
  switch (action.type) {
    case 'get':
      return { ...state, loading: true }
    case 'success':
      return {
        ...state,
        data: action.payload!.data,
        error: null,
        loading: false,
        loaded: true
      }
    case 'error':
      return {
        ...state,
        error: action.payload!.error,
        loading: false
      }
    case 'update':
      const { data } = action.payload!
      if (data.constructor.name === 'Array') {
        return {
          ...state,
          data
        }
      }
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload!.data
        }
      }
    default:
      return state
  }
}

type Reverse<T> = (...args: any) => Promise<T>
type ReturnType<T> = State<T> & { retry: () => void; update: (data: Partial<T>) => void }

function useDataLoader<T>(getData: Reverse<T>, ...args: any): ReturnType<T> {
  const [nonce, setNonce] = useState(Date.now())
  const [state, dispatch] = useReducer(reducer, {
    data: undefined,
    error: undefined,
    loading: true,
    loaded: false
  }) as [State<T>, Dispatch<Action>]

  useEffect(() => {
    let cancel = false
    dispatch({ type: 'get' })
    getData(...args)
      .then((data: any) => {
        if (cancel) return
        if (data.errors && data.errors.length) {
          return dispatch({ type: 'error', payload: { error: data.errors[0] } })
        }
        dispatch({ type: 'success', payload: { data } })
      })
      .catch((error: any) => {
        if (cancel) return
        dispatch({ type: 'error', payload: { error } })
      })

    return () => {
      cancel = true
    }
  }, [nonce, ...args])

  const retry = () => setNonce(Date.now())

  const update = (data: Partial<T>) => dispatch({ type: 'update', payload: { data } })

  return {
    ...state,
    retry,
    update
  }
}

export default useDataLoader
