import { useState, useReducer, useEffect, Dispatch, useRef } from 'react'

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


const __cache = new Map()
function cacheGet(key: string) {
  if (!key) return undefined
  return __cache.get(key) || { data: undefined }
}
function cacheSet(key: string, value: any) {
  return __cache.set(key, value)
}
function cacheClear(key: string) {
  return __cache.delete(key)
}

type PropertyFunction<T> = () => T
type KeyArgs = string | PropertyFunction<string>

const getKey = (_key: KeyArgs): string => {
  let key
  if (typeof _key === 'function') {
    try {
      key = _key()
    } catch (err) {
      key = ''
    }
  } else {
    key = String(_key || '')
  }
  return key
}

export function useSWR<T>(_key: KeyArgs, getData: Reverse<T>, ...args: any): ReturnType<T> {
  const useCache = !!_key
  const key = getKey(_key)
  const keyRef = useRef(key)

  const [nonce, setNonce] = useState(Date.now())
  const [state, dispatch] = useReducer(reducer, {
    data: useCache ? (cacheGet(key) ? cacheGet(key).data : undefined) : undefined,
    error: undefined,
    loading: true,
    loaded: false
  }) as [State<T>, Dispatch<Action>]


  const retry = () => setNonce(Date.now())

  const update = (data: Partial<T>) => dispatch({ type: 'update', payload: { data } })

  useEffect(() => {
    if (!useCache) return
    if (key !== keyRef.current) {
      cacheClear(keyRef.current)
      keyRef.current = key
    }
  }, [key])

  useEffect(() => {
    if (!key && useCache) return
    let cancel = false
    dispatch({ type: 'get' })
    getData(...args)
      .then((data: any) => {
        if (cancel) return
        if (data.errors && data.errors.length) {
          return dispatch({ type: 'error', payload: { error: data.errors[0] } })
        }
        useCache && cacheSet(key, { data, retry, update })
        dispatch({ type: 'success', payload: { data } })
      })
      .catch((error: any) => {
        if (cancel) return
        dispatch({ type: 'error', payload: { error } })
      })

    return () => {
      cancel = true
    }
  }, [nonce, key, ...args])


  return {
    ...state,
    retry,
    update
  }
}

function useDataLoader<T>(getData: Reverse<T>, ...args: any): ReturnType<T> {
  return useSWR<T>('', getData, ...args)
}

export default useDataLoader
