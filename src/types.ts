export type Replacer = (value: any, path: Array<string | number>) => any;
export type Encoder = (value?: any) => Replacer;

export type Reviver = (value: any, path: Array<string | number>) => any;
export type Decoder = (value?: any) => Reviver;

export type Path = Array<string | number>;
