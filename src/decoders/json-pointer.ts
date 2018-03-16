import * as jsonpointer from 'jsonpointer';
import { AJSON } from '..';
import { Path, DecendFunction } from '../types';

export const recurseObjectsInPlace = () => {
  return (v, path: Path, decend: DecendFunction) => {
    if (v !== null && isPojo(v)) {
      return Object.keys(v).reduce((acc, key) => {
        acc[key] = decend(v[key], path.concat([key]));
        return acc;
      }, v);
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

export const recurseArraysInPlace = () => {
  return (v: any, path: Path, decend: DecendFunction) => {
    if (Array.isArray(v)) {
      v.forEach((_, i) => {
        v[i] = decend(_, path.concat([i]));
      });
      return v;
    }
    return v;
  };
};

const ptrDecoder = (obj) => {
  return (v: any, path: Path, decend: DecendFunction) => {
    if (v !== null && typeof v === 'object' && v.hasOwnProperty('$ref')) {
      const ptr = v.$ref.replace(/^#/, '');
      return jsonpointer.get(obj, ptr);
    }
    return v;
  };
};

function decodePointers(obj) {
  return new AJSON()
    .addDecoder(recurseObjectsInPlace)
    .addDecoder(recurseArraysInPlace)
    .addDecoder(ptrDecoder)
    .decode(obj);
}

export const decodeJSONPointers = () => {
  return (obj: any, path: Path) => {
    if (path.length === 1) {
      return decodePointers(obj);
    }
    return obj;
  };
};
