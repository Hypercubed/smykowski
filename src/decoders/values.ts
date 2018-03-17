export const decodeSpecialNumbers = () => {
  return (v: any) => {
    if (v !== null && typeof v === 'object' && v.hasOwnProperty('$numberDecimal')) {
      return parseFloat(v.$numberDecimal);
    }
    return v;
  };
};

export const decodeSymbolValue = () => {
  return (v: any) => {
    if (v !== null && typeof v === 'object' && v.hasOwnProperty('$symbol')) {
      return Symbol(v.$symbol);
    }
    return v;
  };
};

export const decodeMap = () => {
  return (v: any) => {
    if (v !== null && typeof v === 'object' && v.hasOwnProperty('$map')) {
      return new Map(v.$map);
    }
    return v;
  };
};

export const decodeBufferValue = () => {
  return (v: any) => {
    if (v !== null && typeof v === 'object' && v.hasOwnProperty('$binary')) {
      return new Buffer(v.$binary, 'base64');
    }
    return v;
  };
};

export const decodeSet = () => {
  return (v: any) => {
    if (v !== null && typeof v === 'object' && v.hasOwnProperty('$set')) {
      return new Set(v.$set);
    }
    return v;
  };
};
