import { Path, DecendFunction } from '../types';

export const specialNumbers = () => {
  return v => {
    if (typeof v === 'number') {
      if (Object.is(v, -0)) return { $numberDecimal: '-0' };
      if (Number.isNaN(v)) return { $numberDecimal: 'NaN' };
      if (!Number.isFinite(v)) return { $numberDecimal: v.toString() };
    }
    return v;
  };
};

export const symbolValue = () => {
  return v => {
    if (typeof v === 'symbol') {
      return { $symbol: String(v).slice(7, -1)};
    }
    return v;
  };
};

export const toJSON = () => {
  return (v: any, path: Path, decend: DecendFunction) => {
    if (v !== null && typeof v.toJSON === 'function') {
      return decend(v.toJSON(), path);
    }
    return v;
  };
};

export const bufferValue = () => {
  return (v: any) => {
    if (v instanceof Buffer) {
      return { $binary: v.toString('base64') };
    }
    return v;
  };
};
