import { useEffect, FC, ReactElement } from 'react'
/**
 * 设置 document.title
 * @param title
 * @param useReset 组件在 unmount 后 document.title 是否重置为上一次 title
 */
const useTitle = (title: string, useReset?: boolean) => {
  useEffect(() => {
    let lastTitle = ''
    if (document.title !== title) {
      lastTitle = document.title
      document.title = title
    }
    return () => {
      if (useReset && lastTitle) {
        document.title = lastTitle
      }
    }
  }, [title])
}

interface IProps {
  title: string
  useReset?: boolean
}
export const DocumentTitle: FC<IProps> = props => {
  useTitle(props.title, props.useReset)
  return props.children as ReactElement || null
}

useTitle.DocumentTitle = DocumentTitle

export default useTitle
