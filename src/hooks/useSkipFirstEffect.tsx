import { useRef, useEffect } from 'react';

export function useSkipFirstEffect(callback: () => void, deps: unknown[]) {
  const didMount = useRef<unknown>();

  useEffect(() => {
    let didCancel = false;

    if (didMount.current && didCancel === false) {
      return callback();
    }

    didMount.current = true;

    return () => {
      didCancel = true;
    };
  }, deps);
}
