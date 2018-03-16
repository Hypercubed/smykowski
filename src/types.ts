export type DecendFunction = (v: any, path: Array<string | number>) => any;

export type Replacer = (value: any, path: Array<string | number>, decend: DecendFunction) => any;
export type Encoder = (value?: any) => Replacer;

export type Path = Array<string | number>;
