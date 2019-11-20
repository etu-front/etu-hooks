"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const querystring_1 = __importDefault(require("querystring"));
/**
 * 通用过滤器， 当传入 router 时，默认数据可从 query 参数中获取， 更改过滤数据，自动跳转带上过滤参数 querystring 的页面
 */
const useFilter = (defaultFilter = {}, validFilterKeys = [], routerSync) => {
    let f = defaultFilter;
    if (routerSync) {
        f = Object.assign({}, defaultFilter);
        const query = querystring_1.default.parse(window.location.search.slice(1));
        validFilterKeys.forEach(k => {
            if (typeof query[k] !== 'undefined')
                f[k] = query[k];
        });
    }
    const [filter, setFilter] = react_1.useState(f);
    /**
     * 更改过滤器，当使用 router 更改路径时， 由于 router.query 的值会自动转字符串，注意把 filter 的数字值转为 string 类型
     */
    const changeFilter = react_1.useCallback((fields) => {
        if (!fields) {
            return setFilter({});
        }
        let query = {};
        if (routerSync) {
            validFilterKeys.forEach(k => {
                if (typeof fields[k] !== 'undefined')
                    query[k] = fields[k];
            });
        }
        else {
            query = Object.assign({}, fields);
        }
        setFilter(query);
    }, [filter]);
    return {
        filter,
        changeFilter
    };
};
exports.default = useFilter;
//# sourceMappingURL=useFilter.js.map