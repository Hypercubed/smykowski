export const AJSON = {
  stringify(value: any, replacer?: (key: string, value: any) => any, space?: string | number): string {
    return JSON.stringify(value, replacer, space);
  }
};
