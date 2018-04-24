export type Replacer = (value: any, path: Array<string | number>) => any;
export type Encoder = (value?: any, ...args) => Replacer;

export type Reviver = (value: any, path: Array<string | number>) => any;
export type Decoder = (value?: any) => Reviver;

export type Path = Array<string | number>;

export interface Constructor {
  fromJSON: (val: any) => any;
  new(...args: any[]): any;
}
