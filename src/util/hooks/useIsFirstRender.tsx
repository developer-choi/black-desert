import {useEffect, useRef} from "react";

export default function useIsFirstRender() {
  const ref = useRef(true);
  useEffect(() => {
    ref.current = false;
  }, []);
  return ref.current;
}
