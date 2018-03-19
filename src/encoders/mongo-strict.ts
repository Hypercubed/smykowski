export const encodeUndefined = () => {
  return (v: any) => typeof v === 'undefined' ? { $undefined: true } : v;
};

export const encodeRegexps = () => {
  return (v: any) => {
    if (v instanceof RegExp) {
      return {
        $regex: v.source,
        $options: v.flags
      };
    }
    return v;
  };
};

export const encodeDates = () => {
  return (v: any) => {
    if (v instanceof Date) {
      return { $date: v.toISOString() };
    }
    return v;
  };
};
