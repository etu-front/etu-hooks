import { useCallback, useState } from 'react'

const useArray = (initial: any) => {
  const [value, setValue] = useState(initial)
  return {
    value,
    setValue,
    add: useCallback((newVal: any) => setValue(value.concat([newVal])), []),
    clear: useCallback(() => setValue([]), []),
    removeIndex: useCallback((index: any) => {
      setValue((oldValue: any[]) => {
        const newValue = [...oldValue]
        newValue.splice(index, 1)
        return newValue
      })
    }, []),
    removeById: useCallback((id: any) => {
      setValue((oldValue: any[]) => oldValue.filter((v: { id: any }) => v.id !== id))
    }, [])
  }
}
export default useArray
