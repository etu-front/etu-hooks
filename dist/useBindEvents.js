import { useEffect, useCallback } from 'react';
/**
 * 对 dom 或 document 绑定事件
 * @param events BindEvent
 * @param _target 默认
 */
const useBindEvents = (events, _target) => {
    const target = _target || (typeof window !== 'undefined' ? window.document : null);
    const addEvent = useCallback((name, handler) => {
        if (!name || !handler || !target)
            return;
        target.addEventListener(name, handler);
    }, [target]);
    const removeEvent = useCallback((name, handler) => {
        if (!name || !handler || !target)
            return;
        target.removeEventListener(name, handler);
    }, [target]);
    useEffect(() => {
        if (!events || !target)
            return;
        if (Array.isArray(events)) {
            if (!events.length)
                return;
            events.forEach(event => addEvent(event.name, event.handler));
            return () => {
                events.forEach(event => removeEvent(event.name, event.handler));
            };
        }
        if (!events.name || !events.handler)
            return;
        return addEvent(events.name, events.handler);
    }, []);
};
export default useBindEvents;
//# sourceMappingURL=useBindEvents.js.map