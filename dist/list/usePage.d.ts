declare const usePage: (defaultPage: number, defaultPageSize: number, routerSync?: boolean | undefined) => {
    pagination: {
        page: number;
        pageSize: number;
    };
    changePage: (newPage: number) => void;
    changePageSize: (newPagesize: number) => void;
};
export default usePage;
