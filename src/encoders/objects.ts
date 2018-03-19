export const encodeMap = () => {
  return (v: any) => {
    if (v instanceof Map) {
      return { $map: Array.from(v) };
    }
    return v;
  };
};

export const encodeSet = () => {
  return (v: any) => {
    if (v instanceof Set) {
      return { $set: Array.from(v) };
    }
    return v;
  };
};

export const toJSON = () => {
  return (v: any) => {
    if (v !== null && typeof v.toJSON === 'function') {
      return v.toJSON();
    }
    return v;
  };
};
