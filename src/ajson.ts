import { Processor, Path } from './types';

export class AJSON {
  private _processors: Processor[] = [];

  encode(value: any): any {
    const reducers = this._processors
      .map(p => p());
    return get(value, ['#']);

    function get(v: any, path: Path): any {
      return reducers.reduce((acc, fn) => fn(acc, path, get), v);
    }
  }

  stringify(value, replacer?, space?) {
    return JSON.stringify(this.encode(value), replacer, space);
  }

  addEncoder(fn: Processor) {
    this._processors.push(fn);
    return this;
  }

  use(plugin: (a: AJSON) => AJSON) {
    plugin(this);
    return this;
  }
}
