export interface IFilter {
    [k: string]: string | string[] | boolean;
}
/**
 * 通用过滤器， 当传入 router 时，默认数据可从 query 参数中获取， 更改过滤数据，自动跳转带上过滤参数 querystring 的页面
 */
declare const useFilter: (defaultFilter?: IFilter, validFilterKeys?: string[], routerSync?: boolean | undefined) => {
    filter: IFilter;
    changeFilter: (fields?: IFilter | undefined) => void;
};
export default useFilter;
