import * as jsonpointer from 'json-pointer';
import { AJSON } from '..';
import { Path } from '../types';

export const decodeJSONPointers = (obj) => {
  const m = new Map();
  return (v: any, path: Path) => {
    if (path.length > 0) {
      if (v !== null && typeof v === 'object') {
        const pathPtr = jsonpointer.compile(path);
        if (v.hasOwnProperty('$ref')) {                                // if is a pointer
          const fromPtr = v.$ref.replace(/^#/, '');
          if (m.has(fromPtr) && typeof m.get(fromPtr) !== 'string') {  //   if ref already points to a value
            v = m.get(fromPtr);                                        //     return that
          } else {
            v = fromPtr;
          }
        }
        m.set(pathPtr, v);  // store values for later
      }
    } else {
      // console.log(m);
      m.forEach((from, to) => {                                        // restore future references
        if (typeof from === 'string') {
          const value = jsonpointer.get(v, from);
          jsonpointer.set(v, to, value);
        }
      });
    }
    return v;
  };
};

function isPointerObject(obj) {
  return obj.hasOwnProperty('$ref') && Object.keys(obj).length === 1;
}
