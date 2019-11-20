"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const lodash_1 = require("lodash");
const router_1 = __importDefault(require("umi/router"));
const querystring_1 = __importDefault(require("querystring"));
const useFilter_1 = __importDefault(require("./useFilter"));
// import Router, { NextRouter } from 'next/router'
const usePage_1 = __importDefault(require("./usePage"));
// Cache Pool
const CACHE_MAP = {};
const useListQuery = ({ apiCall, defaultPage = 1, defaultPageSize = 10, defaultFilter = {}, onError, validFilterKeys = [], cacheKey, routerSync = false }) => {
    const { pagination, changePage, changePageSize } = usePage_1.default(defaultPage, defaultPageSize, routerSync);
    const { filter, changeFilter } = useFilter_1.default(defaultFilter, validFilterKeys, routerSync);
    const initData = Object.assign({ loading: true, pageInfo: Object.assign(Object.assign({}, pagination), { count: 0 }), results: [] }, CACHE_MAP[cacheKey]);
    const [data, setData] = react_1.useState(initData);
    const setLoading = react_1.useCallback((loading) => setData(d => (Object.assign(Object.assign({}, d), { loading }))), []);
    const errorHandler = react_1.useCallback(err => {
        setLoading(false);
        if (onError) {
            onError(err);
        }
        console.error(err);
    }, []);
    const filterRef = react_1.useRef(filter);
    const fetchData = () => {
        if (cacheKey && CACHE_MAP[cacheKey])
            return;
        // 当过滤器有改变时,页码 page 自动切换到第一页
        const filterChanged = !lodash_1.isEqual(filterRef.current, filter);
        filterRef.current = filter;
        if (filterChanged && pagination.page !== 1)
            return changePage(1);
        // 请求数据
        setLoading(true);
        apiCall(Object.assign({}, pagination), lodash_1.isEmpty(filter) ? undefined : lodash_1.map(filter, (value, field) => ({ field, value })))
            .then((resp) => {
            const respData = Object.assign(Object.assign({}, resp), { loading: false, loaded: true });
            if (cacheKey) {
                CACHE_MAP[cacheKey] = respData;
            }
            setData(respData);
        })
            .catch(errorHandler);
    };
    react_1.useEffect(fetchData, [pagination, filter]);
    // 手动更新 page filter 路由跳转
    react_1.useEffect(() => {
        // 是否同步路由 url
        if (!routerSync)
            return;
        const _a = querystring_1.default.parse(window.location.search.split('?')[1]), { page: queryPage = 1, pageSize: queryPageSize = defaultPageSize } = _a, restQuery = __rest(_a, ["page", "pageSize"]);
        let query = {};
        // filter 处理
        const oldFilter = {};
        const otherQuery = {}; // 不在 filter 名单内的 query
        validFilterKeys.forEach(k => {
            if (typeof restQuery[k] !== 'undefined')
                oldFilter[k] = restQuery[k];
        });
        lodash_1.forEach(restQuery, (v, k) => {
            if (!validFilterKeys.includes(k))
                otherQuery[k] = v;
        });
        const isPageChanged = Number(queryPage) !== pagination.page;
        const isPageSizeChanged = Number(queryPageSize) !== pagination.pageSize;
        const isFilterChanged = !lodash_1.isEqual(oldFilter, filter);
        // 没有任何改变
        if (!isFilterChanged && !isPageChanged && !isPageSizeChanged)
            return;
        // 过滤器改变
        if (isFilterChanged) {
            query = Object.assign(Object.assign({}, otherQuery), filter);
            if (pagination.page !== 1 && !isPageChanged)
                return changePage(1);
        }
        else {
            query = Object.assign({}, restQuery);
        }
        // 设置 page 和 pageSize
        query.pageSize = pagination.pageSize;
        query.page = pagination.page;
        if (isPageSizeChanged) {
            query.page = 1; // 更新 pageSize 时，自动回第一页
        }
        // pageSize 等于默认值，无需 pageSize 参数
        if (pagination.pageSize === defaultPageSize)
            delete query.pageSize;
        // 第一页时，无需 page 参数
        if (Number(query.page) === 1)
            delete query.page;
        // 更新路由
        router_1.default.push({ pathname: window.location.pathname, query });
    }, [pagination, filter]);
    // 浏览器路由变化
    react_1.useEffect(() => {
        if (!routerSync)
            return;
        const _a = querystring_1.default.parse(window.location.search.replace('?', '')), { page: queryPage = 1 } = _a, restQuery = __rest(_a, ["page"]);
        // page
        if (Number(queryPage) !== pagination.page) {
            changePage(Number(queryPage));
        }
        // filter
        const newFilter = {};
        validFilterKeys.forEach(k => {
            if (typeof restQuery[k] !== 'undefined')
                newFilter[k] = restQuery[k];
        });
        if (!lodash_1.isEqual(newFilter, filter))
            changeFilter(newFilter);
    }, [window.location.href]);
    return {
        response: data,
        results: data.results,
        pageInfo: Object.assign(Object.assign({}, data.pageInfo), pagination),
        filter,
        // state and handlers
        loading: data.loading,
        loaded: data.loaded,
        changePage,
        changePageSize,
        changeFilter,
        refresh: fetchData
    };
};
exports.default = useListQuery;
//# sourceMappingURL=useListQuery.js.map