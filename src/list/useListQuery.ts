import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { map, forEach, isEqual, isEmpty } from 'lodash'

import Router from 'umi/router'
import qs from 'querystring'
import useFilter, { IFilter } from './useFilter'
// import Router, { NextRouter } from 'next/router'
import usePage from './usePage'

export interface PageInfo {
  count?: number
  page: number
  pageSize?: number
}

interface ListResponse<T = any> {
  pageInfo: PageInfo
  results: T[]
  [otherField: string]: any
}

interface ListState<T = any> extends ListResponse<T> {
  loading: boolean
  loaded: boolean
}

export interface StateData<T = any> extends ListState<T> {
  filter: IFilter
  changePage: (p: number) => void
  changePageSize: (p: number) => void
  changeFilter: (filter?: IFilter) => void
  refresh: () => void
  response: ListResponse<T>
}

// Cache Pool
const CACHE_MAP: any = {}

export interface ListFilter {
  field: string;
  value: string | boolean | string[]
}

export interface IListApiCall<T = any> {
  (
    page: PageInfo,
    filter?: ListFilter[] | undefined
  ): Promise<ListResponse<T>>
}

interface IParams<T> {
  defaultPage?: number
  defaultPageSize?: number
  defaultFilter?: IFilter
  apiCall: IListApiCall<T>
  filter?: object
  onError?: (e: Error) => any
  validFilterKeys?: string[]
  cacheKey?: string
  routerSync?: boolean
}

/**
 * 通用列表查询
 */
interface IUseListQuery {
  <T>(params: IParams<T>): StateData<T>
}

const useListQuery: IUseListQuery = ({
  apiCall,
  defaultPage = 1,
  defaultPageSize = 10,
  defaultFilter = {},
  onError,
  validFilterKeys = [],
  cacheKey,
  routerSync = false
}) => {
  const { pagination, changePage, changePageSize } = usePage(defaultPage, defaultPageSize, routerSync)
  const { filter, changeFilter } = useFilter(defaultFilter, validFilterKeys, routerSync)

  const initData = {
    loading: true,
    pageInfo: { ...pagination, count: 0 },
    results: [],
    ...CACHE_MAP[cacheKey!]
  }
  const [data, setData]: [ListState, Dispatch<SetStateAction<ListState>>] = useState(initData)

  const setLoading = useCallback((loading: boolean) => setData(d => ({ ...d, loading })), [])

  const errorHandler = useCallback(err => {
    setLoading(false)
    if (onError) {
      onError(err)
    }
    console.error(err)
  }, [])

  const filterRef = useRef(filter)

  const fetchData = () => {
    if (cacheKey && CACHE_MAP[cacheKey]) return
    // 当过滤器有改变时,页码 page 自动切换到第一页
    const filterChanged = !isEqual(filterRef.current, filter)
    filterRef.current = filter
    if (filterChanged && pagination.page !== 1) return changePage(1)
    // 请求数据
    setLoading(true)
    apiCall({ ...pagination }, isEmpty(filter) ? undefined : map(filter, (value, field) => ({ field, value })))
      .then((resp: any) => {
        const respData = { ...resp, loading: false, loaded: true }
        if (cacheKey) {
          CACHE_MAP[cacheKey] = respData
        }
        setData(respData)
      })
      .catch(errorHandler)
  }

  useEffect(fetchData, [pagination, filter])

  // 手动更新 page filter 路由跳转
  useEffect(() => {
    // 是否同步路由 url
    if (!routerSync) return
    const { page: queryPage = 1, pageSize: queryPageSize = defaultPageSize, ...restQuery } = qs.parse(
      window.location.search.split('?')[1]
    )

    let query: any = {}

    // filter 处理
    const oldFilter = {}
    const otherQuery = {} // 不在 filter 名单内的 query
    validFilterKeys.forEach(k => {
      if (typeof restQuery[k] !== 'undefined') oldFilter[k] = restQuery[k]
    })
    forEach(restQuery, (v, k) => {
      if (!validFilterKeys.includes(k)) otherQuery[k] = v
    })

    const isPageChanged = Number(queryPage) !== pagination.page
    const isPageSizeChanged = Number(queryPageSize) !== pagination.pageSize
    const isFilterChanged = !isEqual(oldFilter, filter)

    // 没有任何改变
    if (!isFilterChanged && !isPageChanged && !isPageSizeChanged) return

    // 过滤器改变
    if (isFilterChanged) {
      query = { ...otherQuery, ...filter }
      if (pagination.page !== 1 && !isPageChanged) return changePage(1)
    } else {
      query = { ...restQuery }
    }
    // 设置 page 和 pageSize
    query.pageSize = pagination.pageSize
    query.page = pagination.page

    if (isPageSizeChanged) {
      query.page = 1 // 更新 pageSize 时，自动回第一页
    }

    // pageSize 等于默认值，无需 pageSize 参数
    if (pagination.pageSize === defaultPageSize) delete query.pageSize
    // 第一页时，无需 page 参数
    if (Number(query.page) === 1) delete query.page

    // 更新路由
    Router.push({ pathname: window.location.pathname, query })
  }, [pagination, filter])

  // 浏览器路由变化
  useEffect(() => {
    if (!routerSync) return
    const { page: queryPage = 1, ...restQuery } = qs.parse(window.location.search.replace('?', ''))
    // page
    if (Number(queryPage) !== pagination.page) {
      changePage(Number(queryPage))
    }
    // filter
    const newFilter = {}
    validFilterKeys.forEach(k => {
      if (typeof restQuery[k] !== 'undefined') newFilter[k] = restQuery[k]
    })

    if (!isEqual(newFilter, filter)) changeFilter(newFilter)
  }, [window.location.href])

  return {
    response: data, // original response data
    results: data.results,
    pageInfo: { ...data.pageInfo, ...pagination },
    filter,
    // state and handlers
    loading: data.loading,
    loaded: data.loaded,
    changePage,
    changePageSize,
    changeFilter,
    refresh: fetchData
  }
}

export default useListQuery
