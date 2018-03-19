import * as jsonpointer from 'json-pointer';
import { AJSON } from '..';
import { Path } from '../types';

export const decodeJSONPointers = (obj: any) => {
  const m = new Map<string, object | string>();
  return (v: any, path: Path) => {
    if (path.length > 0) {
      if (v !== null && typeof v === 'object') {
        if (isPointerObject(v)) {                                // if is a pointer
          v = v.$ref.replace(/^#/, '');                          //   get pointer
          if (m.has(v)) v = m.get(v);                            //   return ref if seen
        }
        m.set(jsonpointer.compile(path), v);                     // store values for later
      }
    } else {
      m.forEach((from, to) => {                                  // restore future references
        if (typeof from === 'string') copy(v, from, to);
      });
    }
    return v;
  };
};

function isPointerObject(obj: object): obj is {$ref: string} {
  return obj.hasOwnProperty('$ref') && Object.keys(obj).length === 1;
}

function copy(obj: object, from: string, to: string) {
  const value = jsonpointer.get(obj, from);
  jsonpointer.set(obj, to, value);
}
