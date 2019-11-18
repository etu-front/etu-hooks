import { IFilter } from './useFilter';
export interface PageInfo {
    count?: number;
    page: number;
    pageSize?: number;
}
interface ListResponse<T = any> {
    pageInfo: PageInfo;
    results: T[];
    [otherField: string]: any;
}
interface ListState<T = any> extends ListResponse<T> {
    loading: boolean;
    loaded: boolean;
}
export interface StateData<T = any> extends ListState<T> {
    filter: IFilter;
    changePage: (p: number) => void;
    changePageSize: (p: number) => void;
    changeFilter: (filter?: IFilter) => void;
    refresh: () => void;
    response: ListResponse<T>;
}
export interface ListFilter {
    field: string;
    value: string | boolean | string[];
}
export interface IListApiCall<T = any> {
    (page: PageInfo, filter?: ListFilter[] | undefined): Promise<ListResponse<T>>;
}
interface IParams<T> {
    defaultPage?: number;
    defaultPageSize?: number;
    defaultFilter?: IFilter;
    apiCall: IListApiCall<T>;
    filter?: object;
    onError?: (e: Error) => any;
    validFilterKeys?: string[];
    cacheKey?: string;
    routerSync?: boolean;
}
/**
 * 通用列表查询
 */
interface IUseListQuery {
    <T>(params: IParams<T>): StateData<T>;
}
declare const useListQuery: IUseListQuery;
export default useListQuery;
