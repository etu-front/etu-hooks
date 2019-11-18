import { useState, useReducer, useEffect } from 'react';
function reducer(state, action) {
  switch (action.type) {
    case 'get':
      return { ...state, loading: true };
    case 'success':
      return {
        ...state,
        data: action.payload.data,
        error: null,
        loading: false,
        loaded: true
      };
    case 'error':
      return {
        ...state,
        error: action.payload.error,
        loading: false
      };
    case 'update':
      const { data } = action.payload;
      if (data.constructor.name === 'Array') {
        return {
          ...state,
          data
        };
      }
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload.data
        }
      };
    default:
      return state;
  }
}
function useDataLoader(getData, ...args) {
  const [nonce, setNonce] = useState(Date.now());
  const [state, dispatch] = useReducer(reducer, {
    data: undefined,
    error: undefined,
    loading: true,
    loaded: false
  });
  useEffect(() => {
    let cancel = false;
    dispatch({ type: 'get' });
    getData(...args)
      .then((data) => {
        if (cancel)
          return;
        if (data.errors && data.errors.length) {
          return dispatch({ type: 'error', payload: { error: data.errors[0] } });
        }
        dispatch({ type: 'success', payload: { data } });
      })
      .catch((error) => {
        if (cancel)
          return;
        dispatch({ type: 'error', payload: { error } });
      });
    return () => {
      cancel = true;
    };
  }, [nonce, ...args]);
  const retry = () => setNonce(Date.now());
  const update = (data) => dispatch({ type: 'update', payload: { data } });
  return {
    ...state,
    retry,
    update
  };
}
export default useDataLoader;
//# sourceMappingURL=useDataLoader.js.map
