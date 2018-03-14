export type IGet = (v: any, path: Array<string | number>) => any;

export type Replacer = (value: any, path: Array<string | number>, next: IGet) => any;
export type Processor = () => Replacer;

export type Path = Array<string | number>;
