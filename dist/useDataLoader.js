"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function reducer(state, action) {
    switch (action.type) {
        case 'get':
            return Object.assign(Object.assign({}, state), { loading: true });
        case 'success':
            return Object.assign(Object.assign({}, state), { data: action.payload.data, error: null, loading: false, loaded: true });
        case 'error':
            return Object.assign(Object.assign({}, state), { error: action.payload.error, loading: false });
        case 'update':
            const { data } = action.payload;
            if (data.constructor.name === 'Array') {
                return Object.assign(Object.assign({}, state), { data });
            }
            return Object.assign(Object.assign({}, state), { data: Object.assign(Object.assign({}, state.data), action.payload.data) });
        default:
            return state;
    }
}
const __cache = new Map();
function cacheGet(key) {
    if (!key)
        return undefined;
    return __cache.get(key) || { data: undefined };
}
function cacheSet(key, value) {
    return __cache.set(key, value);
}
function cacheClear(key) {
    return __cache.delete(key);
}
const getKey = (_key) => {
    let key;
    if (typeof _key === 'function') {
        try {
            key = _key();
        }
        catch (err) {
            key = '';
        }
    }
    else {
        // 默认一个随机串，否则 useDataLoader 传 空 key 时， 会不请求数据
        key = String(_key || Date.now() + '-' + Math.random());
    }
    return key;
};
function useSWR(_key, getData, ...args) {
    const useCache = !!_key;
    const key = getKey(_key);
    const keyRef = react_1.useRef(key);
    const [nonce, setNonce] = react_1.useState(Date.now());
    const [state, dispatch] = react_1.useReducer(reducer, {
        data: useCache ? (cacheGet(key) ? cacheGet(key).data : undefined) : undefined,
        error: undefined,
        loading: true,
        loaded: false
    });
    const retry = () => setNonce(Date.now());
    const update = (data) => dispatch({ type: 'update', payload: { data } });
    react_1.useEffect(() => {
        if (!useCache)
            return;
        if (key !== keyRef.current) {
            cacheClear(keyRef.current);
            keyRef.current = key;
        }
    }, [key]);
    react_1.useEffect(() => {
        if (!key)
            return;
        let cancel = false;
        dispatch({ type: 'get' });
        getData(...args)
            .then((data) => {
            if (cancel)
                return;
            if (data.errors && data.errors.length) {
                return dispatch({ type: 'error', payload: { error: data.errors[0] } });
            }
            useCache && cacheSet(key, { data, retry, update });
            dispatch({ type: 'success', payload: { data } });
        })
            .catch((error) => {
            if (cancel)
                return;
            dispatch({ type: 'error', payload: { error } });
        });
        return () => {
            cancel = true;
        };
    }, [nonce, key, ...args]);
    return Object.assign(Object.assign({}, state), { retry,
        update });
}
exports.useSWR = useSWR;
function useDataLoader(getData, ...args) {
    return useSWR('', getData, ...args);
}
exports.default = useDataLoader;
//# sourceMappingURL=useDataLoader.js.map