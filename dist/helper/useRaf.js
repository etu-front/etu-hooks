"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * Requested Animation Frame
 */
const useRaf = (ms = 1e12, delay = 0) => {
    const [elapsed, set] = react_1.useState(0);
    react_1.useEffect(() => {
        let raf;
        let timerStop;
        let start = 0;
        const loop = () => {
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            raf = requestAnimationFrame(onFrame); // eslint-disable-line no-use-before-define
        };
        const onFrame = () => {
            const time = Math.min(1, (Date.now() - start) / ms);
            set(time);
            loop();
        };
        const onStart = () => {
            timerStop = window.setTimeout(() => {
                cancelAnimationFrame(raf);
                set(1);
            }, ms);
            start = Date.now();
            loop();
        };
        const timerDelay = window.setTimeout(onStart, delay);
        return () => {
            clearTimeout(timerStop);
            clearTimeout(timerDelay);
            cancelAnimationFrame(raf);
        };
    }, [ms, delay]);
    return elapsed;
};
exports.default = useRaf;
//# sourceMappingURL=useRaf.js.map