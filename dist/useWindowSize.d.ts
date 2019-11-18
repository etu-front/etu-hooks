/**
 *
 * @param resize 窗口 resize 时 是否重新计算
 */
declare const useWindowSize: (resize?: boolean) => {
    innerHeight: number;
    innerWidth: number;
    outerWidth: number;
    outerHeight: number;
};
export default useWindowSize;
