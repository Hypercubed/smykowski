import { Constructor } from '../types';

export function classDecoder(constuctors) {
  return (v: any) => {
    if (isObject(v)) {
      const [key, ...rest] = Object.keys(v);
      if (rest.length === 0) {
        const ctor = constuctors[key.slice(2)];
        if (ctor && key[0] === '@' && key[1] === '@') {
          return createInstance(v[key], ctor);
        }
      }
    }
    return v;
  };

  function isObject(v: any) {
    return v !== null && typeof v === 'object';
  }

  function createInstance(v: any, ctor: Constructor) {
    if (typeof ctor.fromJSON === 'function') {
      return ctor.fromJSON(v);
    }
    const o = new ctor();
    Object.assign(o, v);
    return o;
  }
}
