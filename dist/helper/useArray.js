"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useArray = (initial) => {
    const [value, setValue] = react_1.useState(initial);
    return {
        value,
        setValue,
        add: react_1.useCallback((newVal) => setValue(value.concat([newVal])), []),
        clear: react_1.useCallback(() => setValue([]), []),
        removeIndex: react_1.useCallback((index) => {
            setValue((oldValue) => {
                const newValue = [...oldValue];
                newValue.splice(index, 1);
                return newValue;
            });
        }, []),
        removeById: react_1.useCallback((id) => {
            setValue((oldValue) => oldValue.filter((v) => v.id !== id));
        }, [])
    };
};
exports.default = useArray;
//# sourceMappingURL=useArray.js.map