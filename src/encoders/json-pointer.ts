import { Path, DecendFunction } from '../types';

export const jsonPointer = () => {
  const repeated = new WeakMap();
  return (v, path: Path) => {
    if (v !== null && typeof v === 'object') {
      if (repeated.has(v)) {
        return { $ref: makePath(repeated.get(v)) };
      }
      repeated.set(v, path);
    }
    return v;
  };

  function makePath(path: any[]): string {
    return path.map(p => {
      return typeof p === 'number' ? `[${p}]` : p;
    }).join('/');
  }  
};
