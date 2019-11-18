"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const lodash_1 = require("lodash");
const querystring_1 = __importDefault(require("querystring"));
const usePage = (defaultPage, defaultPageSize, routerSync) => {
    let p = defaultPage;
    let psize = defaultPageSize;
    if (routerSync) {
        const query = querystring_1.default.parse(window.location.search.slice(1));
        p = Number(lodash_1.get(query, 'page', defaultPage));
        psize = Number(lodash_1.get(query, 'pageSize', defaultPageSize));
    }
    const [pagination, setPagination] = react_1.useState({ page: p, pageSize: psize });
    const changePage = react_1.useCallback((newPage) => {
        if (newPage === pagination.page)
            return;
        setPagination({ page: newPage, pageSize: pagination.pageSize });
    }, [pagination]);
    // 更新 pageSize 时，自动更新 page = 1
    const changePageSize = (newPagesize) => {
        if (newPagesize === pagination.pageSize)
            return;
        setPagination({ pageSize: newPagesize, page: 1 });
    };
    return {
        // page: pagination.page,
        // pageSize: pagination.pageSize,
        pagination,
        changePage,
        changePageSize
    };
};
exports.default = usePage;
//# sourceMappingURL=usePage.js.map