interface BindEvent {
    name: string;
    handler: (event: any) => void;
}
/**
 * 对 dom 或 document 绑定事件
 * @param events BindEvent
 * @param _target 默认
 */
declare const useBindEvents: (events?: BindEvent | BindEvent[] | undefined, _target?: Document | HTMLElement | undefined) => void;
export default useBindEvents;
