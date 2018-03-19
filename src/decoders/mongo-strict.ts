export const decodeUndefined = () => {
  return (v: any) => {
    if (v !== null && typeof v === 'object' && v.hasOwnProperty('$undefined')) {
      return undefined;
    }
    return v;
  };
};

export const decodeRegexps = () => {
  return (v: any) => {
    if (v !== null && typeof v === 'object' && v.hasOwnProperty('$regex')) {
      return new RegExp(v.$regex, v.$options);
    }
    return v;
  };
};

export const decodeDates = () => {
  return (v: any) => {
    if (v !== null && typeof v === 'object' && v.hasOwnProperty('$date')) {
      return new Date(v.$date);
    }
    return v;
  };
};
