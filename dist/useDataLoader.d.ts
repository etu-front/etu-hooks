interface State<T = any> {
    data: T;
    error?: any;
    loading: boolean;
    loaded: boolean;
}
declare type Reverse<T> = (...args: any) => Promise<T>;
declare type ReturnType<T> = State<T> & {
    retry: () => void;
    update: (data: Partial<T>) => void;
};
declare type PropertyFunction<T> = () => T;
declare type KeyArgs = string | PropertyFunction<string>;
export declare function useSWR<T>(_key: KeyArgs, getData: Reverse<T>, ...args: any): ReturnType<T>;
declare function useDataLoader<T>(getData: Reverse<T>, ...args: any): ReturnType<T>;
export default useDataLoader;
