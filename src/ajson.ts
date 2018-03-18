import { Encoder, Path, Decoder } from './types';

export class AJSON {
  private _encoders: Encoder[] = [];
  private _decoders: Decoder[] = [];

  encode(value: any): any {
    const stack: any = [];
    const encoders = this._encoders.map(p => p());
    return get(value, []);

    function get(v: any, path: Path): any {
      v = encoders.reduce((acc, fn) => fn(acc, path), v);
      const type = Object.prototype.toString.call(v);
      if (type === '[object Array]' || type === '[object Object]') {
        if (stack.includes(v)) {
          throw new Error('Converting circular structure to JSON, consider using the jsonPointer encoder');
        }
        stack.push(v);

        switch (type) {
          case '[object Array]':
            v = v.map((_, i) => get(_, path.concat(i)));
            break;
          case '[object Object]':
            v = Object.keys(v).reduce((acc, key) => {
              acc[key] = get(v[key], path.concat([key]));
              return acc;
            }, {});
        }

        stack.pop();
      }
      return v;
    }
  }

  decode(value: any): any {
    const decoders = this._decoders.map(p => p(value));
    return get(value, []);

    function get(v: any, path: Path): any {
      switch (Object.prototype.toString.call(v)) {
        case '[object Array]':
          v = v.map((_, i) => get(_, path.concat(i)));
          break;
        case '[object Object]':
          v = Object.keys(v).reduce((acc, key) => {
            acc[key] = get(v[key], path.concat([key]));
            return acc;
          }, {});
      }
      return decoders.reduce((acc, fn) => fn(acc, path), v);
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
