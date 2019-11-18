import { useCallback, useState } from 'react';
import { get } from 'lodash';
import qs from 'querystring';
const usePage = (defaultPage, defaultPageSize, routerSync) => {
    let p = defaultPage;
    let psize = defaultPageSize;
    if (routerSync) {
        const query = qs.parse(window.location.search.slice(1));
        p = Number(get(query, 'page', defaultPage));
        psize = Number(get(query, 'pageSize', defaultPageSize));
    }
    const [pagination, setPagination] = useState({ page: p, pageSize: psize });
    const changePage = useCallback((newPage) => {
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
export default usePage;
//# sourceMappingURL=usePage.js.map