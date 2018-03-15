import { test } from 'ava';
import { 
  AJSON,
  recurseArrays,
  defaultEncoders
} from '../';

const asjon = new AJSON()
  .use(defaultEncoders);

test('all', t => {
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

  obj.friends.push(<any>obj);
  obj.friends.push(obj.friends[0]);

  t.snapshot(asjon.stringify(obj));
});

test('demo', t => {
  const foo = () => {
    const FOO = 'foo';
    return value => {
      return Array.isArray(value) ? value : FOO;
    };
  };

  const _recurseArrays = () => {
    return (value, path, next) => {
      if (Array.isArray(value)) {
        return value.map((v, i) => next(v, [...path, i]));
      }
      return value;
    };
  };

  const a = new AJSON()
    .addEncoder(recurseArrays)
    .addEncoder(foo);

  t.snapshot(a.stringify([1, 2, 3]));
});
