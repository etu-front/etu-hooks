import React, { useEffect, useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import N, { NProgressOptions } from 'nprogress'

const GlobalStyle = createGlobalStyle<{ primaryColor?: string }>`
  #nprogress {
    pointer-events: none;
    .bar {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 1024;
      width: 100%;
      height: 2px;
      background: ${props => props.primaryColor};
    }
    .peg {
      position: absolute;
      right: 0;
      display: block;
      width: 100px;
      height: 100%;
      box-shadow: 0 0 10px ${props => props.primaryColor},
        0 0 5px ${props => props.primaryColor};
      transform: rotate(3deg) translate(0, -4px);
      opacity: 1;
    }
  }
  #nprogress .spinner {
    display: block;
    position: fixed;
    z-index: 1031;
    top: 15px;
    right: 15px;
  }

  #nprogress .spinner-icon {
    width: 18px;
    height: 18px;
    box-sizing: border-box;

    border: solid 2px transparent;
    border-top-color: ${props => props.primaryColor};
    border-left-color: ${props => props.primaryColor};
    border-radius: 50%;

    -webkit-animation: nprogress-spinner 400ms linear infinite;
            animation: nprogress-spinner 400ms linear infinite;
  }

  .nprogress-custom-parent {
    overflow: hidden;
    position: relative;
  }
  .nprogress-custom-parent #nprogress .spinner,
  .nprogress-custom-parent #nprogress .bar {
    position: absolute;
  }

  @-webkit-keyframes nprogress-spinner {
    0%   { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }
  @keyframes nprogress-spinner {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export const useNProgress = (
  url: string, loading: boolean, primaryColor: string = '', options: Partial<NProgressOptions> = {}
) => {
  const [last, setHref] = useState(url)
  useEffect(() => {
    N.configure({ showSpinner: options.showSpinner, speed: options.speed || 200 })
  }, [])

  useEffect(() => {
    if (last === url) return
    N.start()
    if (!loading) {
      N.done()
      setHref(url)
    }
  }, [url, loading])
  return <GlobalStyle primaryColor={primaryColor} />
}

interface NProgressProps {
  url: string
  loading: boolean
  primaryColor?: string
  options?: Partial<NProgressOptions>
}

const NProgress: React.FC<NProgressProps> = ({
  url,
  loading,
  primaryColor,
  options = { showSpinner: false, speed: 200 }
}) => useNProgress(url, loading, primaryColor, options)

export default NProgress
