import { Constructor } from '../types';

export function classEncoder(constuctors) {
  const ctorMap = new WeakMap<Constructor, string>(
    (Object as any).entries(constuctors).map(a => [a[1], a[0]])
  );
  return (v: any) => (isObject(v) && ctorMap.has(v.constructor)) ?
    { [`@@${ctorMap.get(v.constructor)}`]: {...v} } :
    v;

  function isObject(v: any) {
    return v !== null && typeof v === 'object';
  }
}
