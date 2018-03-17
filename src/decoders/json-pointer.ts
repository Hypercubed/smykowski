import * as jsonpointer from 'json-pointer';
import { AJSON } from '..';
import { Path } from '../types';

export const decodeJSONPointers = (obj) => {
  const m = new Map();
  return (v: any, path: Path) => {
    if (path.length > 0) {
      if (v !== null && typeof v === 'object' && v.hasOwnProperty('$ref')) {
        const ptr = jsonpointer.compile(path);
        m.set(ptr, v.$ref.replace(/^#/, ''));
      }
    } else {
      m.forEach((from, to) => {
        const value = jsonpointer.get(v, from);
        jsonpointer.set(v, to, value);
      });
    }
    return v;
  };
};
