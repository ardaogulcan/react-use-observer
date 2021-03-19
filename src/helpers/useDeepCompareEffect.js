/*
  Copy of https://github.com/kentcdodds/use-deep-compare-effect
  uses fast-deep-equal instead to support IE9+
*/
import React from 'react';
import deepEqual from 'fast-deep-equal';

function isPrimitive(val) {
  return val == null || /^[sbn]/.test(typeof val);
}

function checkDeps(deps) {
  if (!deps || !deps.length) {
    throw new Error('useDeepCompareEffect should not be used with no dependencies. Use React.useEffect instead.');
  }
  if (deps.every(isPrimitive)) {
    throw new Error('useDeepCompareEffect should not be used with dependencies that are all primitive values. Use React.useEffect instead.');
  }
}

function useDeepCompareMemoize(value) {
  const ref = React.useRef();
  const signalRef = React.useRef(0);

  if (!deepEqual(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }
  return [signalRef.current];
}
function useDeepCompareEffect(callback, dependencies) {
  if (process.env.NODE_ENV !== 'production') {
    checkDeps(dependencies);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useEffect(callback, useDeepCompareMemoize(dependencies));
}
export function useDeepCompareEffectNoCheck(callback, dependencies) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useEffect(callback, useDeepCompareMemoize(dependencies));
}
export default useDeepCompareEffect;
