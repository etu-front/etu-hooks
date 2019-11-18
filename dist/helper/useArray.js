import { useCallback, useState } from 'react';
const useArray = (initial) => {
    const [value, setValue] = useState(initial);
    return {
        value,
        setValue,
        add: useCallback((newVal) => setValue(value.concat([newVal])), []),
        clear: useCallback(() => setValue([]), []),
        removeIndex: useCallback((index) => {
            setValue((oldValue) => {
                const newValue = [...oldValue];
                newValue.splice(index, 1);
                return newValue;
            });
        }, []),
        removeById: useCallback((id) => {
            setValue((oldValue) => oldValue.filter((v) => v.id !== id));
        }, [])
    };
};
export default useArray;
//# sourceMappingURL=useArray.js.map