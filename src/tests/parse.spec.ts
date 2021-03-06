import { test } from 'ava';
import * as jsonpointer from 'json-pointer';

import { 
  Smykowski,
  defaultEncoders,
  defaultDecoders
} from '../';

const asjon = new Smykowski()
  .use(defaultEncoders)
  .use(defaultDecoders);

test('all', t => {

  const obj = {
    _id: '5aa882d3638a0f580d92c677',
    index: 0,
    name: {
      first: 'Valenzuela',
      last: 'Valenzuela'
    },
    registered: new Date(2014, 0, 1),
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

  const str = asjon.stringify(obj);
  t.deepEqual(asjon.parse(str), obj);
});
