import { test } from 'ava';
import { Person } from './fixtures/person';

import { 
  Smykowski,
  jestSerializer
} from '../';

test('custom encoder', t => {
  const person = new Person('Benton', 'Chase');
  const a = new Smykowski()
    .addEncoder(() => v => (v instanceof Person) ? { '@@Person': `${v.last}, ${v.first}` } : v);
  t.deepEqual(a.encode(person), { '@@Person': 'Chase, Benton' });
});

test('jest-serializer', t => {
  const a = new Smykowski()
    .addEncoder(jestSerializer);

  const objs = [
    3,
    null,
    [0, true, '2', [3.14, {}, null]],
    {key1: 'foo', key2: 'bar', key3: {array: [null, {}]}},
    {minusInf: -Infinity, nan: NaN, plusInf: +Infinity},
    {date: new Date(1234567890), re: /foo/gi},
    {map: new Map<any, any>([[NaN, 4], [undefined, 'm']]), set: new Set([undefined, NaN])},
    {buf: Buffer.from([255, 255, 255])},
  ];

  t.snapshot(a.encode(objs));
});
