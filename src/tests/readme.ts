import * as jsonpointer from 'json-pointer';

import { 
  Smykowski,
  defaultEncoders,
  defaultDecoders
} from '..';

function usageExample() {
  const asjon = new Smykowski()
    .use(defaultEncoders)
    .use(defaultDecoders);

  const obj = {
    _id: '5aa882d3638a0f580d92c677',
    index: 0,
    name: {
      first: 'Valenzuela',
      last: 'Valenzuela'
    },
    registered: new Date(2014, 0, 1),
    symbol: Symbol('banana'),
    range: [
      -Infinity, 0, 1, 2, 3, 4, 5, 6, 7, 8, Infinity
    ],
    friends: [
      {
        id: -0,
        name: 'Benton Chase'
      },
      {
        id: 1,
        name: 'Mccarthy Morgan'
      },
      {
        id: NaN,
        name: 'Kaufman Price'
      }
    ]
  };

  const stringified = asjon.stringify(obj, undefined, 2);
  console.log(stringified);

  const parsed = asjon.parse(stringified);
  console.log(parsed);
}

function pluginExample() {
  const foo = () => {
    const FOO = 'foo';
    return value => {
      return Array.isArray(value) ? value : FOO;
    };
  };

  const jsonPointer = () => {
    const repeated = new WeakMap();
    return (v, path) => {
      if (v !== null && typeof v === 'object') {
        if (repeated.has(v)) {
          return { $ref: '#' + jsonpointer.compile(repeated.get(v)) };
        }
        repeated.set(v, path);
      }
      return v;
    };
  };

  const asjon = new Smykowski()
    .addEncoder(foo)
    .addEncoder(jsonPointer);

  const arr = [1, 2, 3];
  console.log(asjon.stringify([arr, arr]));
}

usageExample();
pluginExample();
