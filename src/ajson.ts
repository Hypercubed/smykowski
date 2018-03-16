import { Encoder, Path } from './types';

export class AJSON {
  private _encoders: Encoder[] = [];
  private _decoders: Encoder[] = [];

  encode(value: any): any {
    const reducers = this._encoders
      .map(p => p());
    return get(value, ['#']);

    function get(v: any, path: Path): any {
      return reducers.reduce((acc, fn) => fn(acc, path, get), v);
    }
  }

  decode(value: any): any {
    const decoders = this._decoders
      .map(p => p(value));
    return get(value, ['#']);

    function get(v: any, path: Path): any {
      return decoders.reduce((acc, fn) => fn(acc, path, get), v);
    }
  }

  stringify(value: any, replacer?, space?: string | number | undefined) {
    return JSON.stringify(this.encode(value), replacer, space);
  }

  parse(value: string, reviver?) {
    return this.decode(JSON.parse(value, reviver));
  }

  addEncoder(fn: Encoder) {
    this._encoders.push(fn);
    return this;
  }

  addDecoder(fn: Encoder) {
    this._decoders.push(fn);
    return this;
  }

  use(plugin: (a: AJSON) => AJSON) {
    plugin(this);
    return this;
  }
}
