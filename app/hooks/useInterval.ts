import {useEffect, useRef} from 'react';

export default function useInterval(
  callback: () => void,
  delay: number | null,
) {
  // original from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
  const emptyCallback = () => {};
  const savedCallback = useRef(emptyCallback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
