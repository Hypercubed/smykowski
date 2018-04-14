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

export const stableObject = () => {
  return (v: any) => {
    if (typeof v !== 'object' || v === null || Array.isArray(v)) return v;
    return Object.keys(v).sort().reduce((acc, key) => {
      acc[key] = v[key];
      return acc;
    }, {});
  };
};
