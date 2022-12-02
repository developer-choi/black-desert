import {useEffect} from 'react';

export default function useSomeCustomHooks() {
  useEffect(() => {
    console.log('hello world');
  }, []);
}
