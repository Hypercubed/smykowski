import { Path, DecendFunction } from '../types';

export const recurseObjects = () => {
  return (v, path: Path, decend: DecendFunction) => {
    if (v !== null && isPojo(v)) {
      return Object.keys(v).reduce((acc, key) => {
        acc[key] = decend(v[key], path.concat([key]));
        return acc;
      }, {});
    }
    return v;
  };

  function isPojo(arg: any): arg is object {
    if (arg === null || typeof arg !== 'object') {
      return false;
    }
    return Object.getPrototypeOf(arg) === Object.prototype;
  }
};

export const recurseArrays = () => {
  return (v: any, path: Path, decend: DecendFunction) => {
    if (Array.isArray(v)) {
      return v.map((_, i) => decend(_, path.concat([i])));
    }
    return v;
  };
};

export const recurseMap = () => {
  return (v: any, path: Path, decend: DecendFunction) => {
    if (v instanceof Map) {
      return { $map: decend(Array.from(v), path) };
    }
    return v;
  };
};

export const recurseSet = () => {
  return (v: any, path: Path, decend: DecendFunction) => {
    if (v instanceof Set) {
      return { $set: decend(Array.from(v), path) };
    }
    return v;
  };
};
