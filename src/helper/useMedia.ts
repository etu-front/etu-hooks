import { useEffect, useState } from 'react'

/**
 * media query
 * @param query '(max-width: 600px)'
 */
const useMedia = (query: string) => {
  const [state, setState] = useState(false)

  useEffect(() => {
    let mounted = true
    const mql = window.matchMedia(query)
    const onChange = () => {
      if (!mounted) return
      setState(!!mql.matches)
    }

    mql.addListener(onChange)
    setState(mql.matches)

    return () => {
      mounted = false
      mql.removeListener(onChange)
    }
  }, [query])

  return state
}

export default useMedia
