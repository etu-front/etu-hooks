/// <reference types="react" />
declare const useArray: (initial: any) => {
    value: any;
    setValue: import("react").Dispatch<any>;
    add: (newVal: any) => void;
    clear: () => void;
    removeIndex: (index: any) => void;
    removeById: (id: any) => void;
};
export default useArray;
