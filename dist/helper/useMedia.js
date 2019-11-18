"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * media query
 * @param query '(max-width: 600px)'
 */
const useMedia = (query) => {
    const [state, setState] = react_1.useState(false);
    react_1.useEffect(() => {
        let mounted = true;
        const mql = window.matchMedia(query);
        const onChange = () => {
            if (!mounted)
                return;
            setState(!!mql.matches);
        };
        mql.addListener(onChange);
        setState(mql.matches);
        return () => {
            mounted = false;
            mql.removeListener(onChange);
        };
    }, [query]);
    return state;
};
exports.default = useMedia;
//# sourceMappingURL=useMedia.js.map