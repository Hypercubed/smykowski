import { test } from 'ava';

import { AJSON, defaultDecoders } from '..';
import { Person } from './fixtures/person';

const asjon = new AJSON()
  .use(defaultDecoders);

test('prim values', t => {
  t.deepEqual(asjon.decode(42), 42, 'number');
  t.deepEqual(asjon.decode(-42), -42, 'negative number');
  t.deepEqual(asjon.decode('woo!!!'), 'woo!!!', 'string');
  t.deepEqual(asjon.decode(true), true, 'boolean');
  t.deepEqual(asjon.decode(null), null, 'null');
});

test('objects', t => {
  t.deepEqual(asjon.decode(['a', 'b', 'c']), ['a', 'b', 'c'], 'Array');
  t.deepEqual(asjon.decode([]), [], 'Array (empty)');
  t.deepEqual(asjon.decode({ foo: 'bar', 'x-y': 'z' }), { foo: 'bar', 'x-y': 'z'}, 'Object');
  t.deepEqual(asjon.decode({ $set: [1, 2, 3] }), new Set([1, 2, 3]), 'Set');
  t.deepEqual(asjon.decode({ $map: [['a', 'b']] }), new Map([['a', 'b']]), 'Map');
});

test('special values', t => {
  t.deepEqual(asjon.decode({ $numberDecimal: '-0' }), -0, 'negative zero');
  t.deepEqual(asjon.decode({ $numberDecimal: 'NaN' }), NaN, 'NaN');
  t.deepEqual(asjon.decode({ $numberDecimal: 'Infinity' }), Infinity, 'Infinity');
  t.deepEqual(asjon.decode({ $numberDecimal: '-Infinity' }), -Infinity, 'Neg Infinity');
  t.deepEqual(asjon.decode({ $undefined: true }), undefined, 'undefined');
  t.deepEqual(asjon.decode({ $regex: 'regexp', $options: 'gim' }), /regexp/img, ' RegExp');
  t.deepEqual(asjon.decode({ $date: '2001-09-09T01:46:40.000Z' }), new Date(1e12), 'Date');
  t.deepEqual(asjon.decode({ $symbol: 'a' }).toString(), Symbol('a').toString(), 'Symbol');
});

test('objects with special values', t => {
  t.deepEqual(asjon.decode(
    ['a', { $date: '2001-09-09T01:46:40.000Z'}, 'c']),
    ['a', new Date(1e12), 'c'],
    'Array');
  t.deepEqual(asjon.decode(
    { foo: 'bar', 'x-y': { $date: '2001-09-09T01:46:40.000Z' }}),
    { foo: 'bar', 'x-y': new Date(1e12)},
    'Object');
  t.deepEqual(asjon.decode(
    { $set: [1, { $date: '2001-09-09T01:46:40.000Z' }, 3]}),
    new Set([1, new Date(1e12), 3]),
    'Set');
  t.deepEqual(asjon.decode(
    { $map: [['a', { $date: '2001-09-09T01:46:40.000Z' }]]}),
    new Map([['a', new Date(1e12)]]), 
    'Map');
});

test('buffer', t => {
  t.deepEqual(asjon.decode({ $binary: '////' }), new Buffer([255, 255, 255]), 'Buffer');
});

test('self referential', t => {
  const self = asjon.decode({ a: { $ref: '#'} });
  t.is(self, self.a, 'object');
  t.deepEqual(self, { a: self });

  const arr = asjon.decode([{ $ref: '#' }]);
  t.is(arr, arr[0], 'array');
  t.deepEqual(arr, [arr]);

  /* const map: Map<string, any> = asjon.decode({ $map: [['self', { $ref: '#'}]]});
  t.is(map, map.get('self'), 'array');

  const set: Set<any> = asjon.decode({ $set: [{ $ref: '#' }, 42]});
  t.is(map, set.values[0], 'array'); */
});

test('references', t => {
  const a = asjon.decode({a: 1, b: {}, c: {$ref: '#/b'}});
  t.deepEqual(a, {a: 1, b: {}, c: a.b});

  const b = asjon.decode({ a: 1, b: { c: {}}, c: { $ref: '#/b/c'}});
  t.deepEqual(b, { a: 1, b: { c: {}}, c: b.b.c });
});
