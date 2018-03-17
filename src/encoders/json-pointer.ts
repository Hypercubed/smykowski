import * as jsonpointer from 'json-pointer';
import { Path } from '../types';

export const jsonPointer = () => {
  const repeated = new WeakMap();
  return (v, path: Path) => {
    if (v !== null && typeof v === 'object') {
      if (repeated.has(v)) {
        return { $ref: '#' + jsonpointer.compile(repeated.get(v)) };
      }
      repeated.set(v, path);
    }
    return v;
  };
};
