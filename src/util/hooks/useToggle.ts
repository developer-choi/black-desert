import {useCallback, useState} from 'react';

export default function useToggle(initialValue: boolean) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prevState => !prevState);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse
  };
};
