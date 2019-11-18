import { useCallback, useState } from 'react'
import qs from 'querystring'

export interface IFilter {
  [k: string]: string | string[] | boolean
}

/**
 * 通用过滤器， 当传入 router 时，默认数据可从 query 参数中获取， 更改过滤数据，自动跳转带上过滤参数 querystring 的页面
 */
const useFilter = (defaultFilter: IFilter = {}, validFilterKeys: string[] = [], routerSync?: boolean) => {
  let f = defaultFilter
  if (routerSync) {
    f = { ...defaultFilter }
    const query = qs.parse(window.location.search.slice(1))
    validFilterKeys.forEach(k => {
      if (typeof query[k] !== 'undefined') f[k] = query[k]
    })
  }
  const [filter, setFilter] = useState(f)

  /**
   * 更改过滤器，当使用 router 更改路径时， 由于 router.query 的值会自动转字符串，注意把 filter 的数字值转为 string 类型
   */
  const changeFilter = useCallback(
    (fields?: IFilter) => {
      if (!fields) {
        return setFilter({})
      }
      let query = {}
      if (routerSync) {
        validFilterKeys.forEach(k => {
          if (typeof fields[k] !== 'undefined') query[k] = fields[k]
        })
      } else {
        query = { ...fields }
      }
      setFilter(query)
    },
    [filter]
  )

  return {
    filter,
    changeFilter
  }
}

export default useFilter
