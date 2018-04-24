import { Path } from '../types';

export const encodeSpecialNumbers = () => {
  return (v: any) => {
    if (typeof v === 'number') {
      if (Object.is(v, -0)) return { $numberDecimal: '-0' };
      if (Number.isNaN(v)) return { $numberDecimal: 'NaN' };
      if (!Number.isFinite(v)) return { $numberDecimal: v.toString() };
    }
    return v;
  };
};

export const encodeSymbols = () => {
  return (v: any) => {
    if (typeof v === 'symbol') {
      return { $symbol: String(v).slice(7, -1)};
    }
    return v;
  };
};

export const encodeBuffers = () => {
  return (v: any) => {
    if (typeof Buffer !== 'undefined' && v instanceof Buffer) {
      return { $binary: v.toString('base64') };
    }
    return v;
  };
};
