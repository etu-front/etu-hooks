import { useEffect, useState } from 'react'
import throttle from 'lodash/throttle'

function getSize() {
  if (typeof window === 'undefined') {
    return {
      innerHeight: 0,
      innerWidth: 0,
      outerWidth: 0,
      outerHeight: 0
    }
  }
  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth
  }
}
/**
 *
 * @param resize 窗口 resize 时 是否重新计算
 */
const useWindowSize = (resize = true) => {
  const [windowSize, setWindowSize] = useState(getSize())
  const handleResize = throttle(() => setWindowSize(getSize()), 200)
  useEffect(() => {
    if (!resize) return
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return windowSize
}

export default useWindowSize
