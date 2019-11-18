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
declare function useDataLoader<T>(getData: Reverse<T>, ...args: any): ReturnType<T>;
export default useDataLoader;
