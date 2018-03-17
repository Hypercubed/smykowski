import { Path } from '../types';

export const encodeMap = () => {
  return (v: any, path: Path) => {
    if (v instanceof Map) {
      return { $map: Array.from(v) };
    }
    return v;
  };
};

export const encodeSet = () => {
  return (v: any, path: Path) => {
    if (v instanceof Set) {
      return { $set: Array.from(v) };
    }
    return v;
  };
};
