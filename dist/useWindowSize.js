"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const throttle_1 = __importDefault(require("lodash/throttle"));
function getSize() {
    if (typeof window === 'undefined') {
        return {
            innerHeight: 0,
            innerWidth: 0,
            outerWidth: 0,
            outerHeight: 0
        };
    }
    return {
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth,
        outerHeight: window.outerHeight,
        outerWidth: window.outerWidth
    };
}
/**
 *
 * @param resize 窗口 resize 时 是否重新计算
 */
const useWindowSize = (resize = true) => {
    const [windowSize, setWindowSize] = react_1.useState(getSize());
    const handleResize = throttle_1.default(() => setWindowSize(getSize()), 200);
    react_1.useEffect(() => {
        if (!resize)
            return;
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowSize;
};
exports.default = useWindowSize;
//# sourceMappingURL=useWindowSize.js.map