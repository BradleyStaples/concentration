import {useEffect, useRef} from 'react';

export default function useInterval(callback: () => void, delay: number | null) {
  // original from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
  const emptyCallback = () => {};
  const savedCallback = useRef(emptyCallback);

  // remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
