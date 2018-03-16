export const undefinedValue = () => {
  return v => typeof v === 'undefined' ? { $undefined: true } : v;
};

export const regexpValue = () => {
  return v => {
    if (v instanceof RegExp) {
      return {
        $regex: v.source,
        $options: v.flags
      };
    }
    return v;
  };
};

export const dateValue = () => {
  return v => {
    if (v instanceof Date) {
      return { $date: v.toISOString() };
    }
    return v;
  };
};
