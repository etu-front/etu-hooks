import { FC } from 'react';
/**
 * 设置 document.title
 * @param title
 * @param useReset 组件在 unmount 后 document.title 是否重置为上一次 title
 */
declare const useTitle: {
    (title: string, useReset?: boolean | undefined): void;
    DocumentTitle: FC<IProps>;
};
interface IProps {
    title: string;
    useReset?: boolean;
}
export declare const DocumentTitle: FC<IProps>;
export default useTitle;
