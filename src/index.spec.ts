import { test } from 'ava';
import { AJSON } from '.';

function stringify(t, input, expected) {
  t.deepEqual(AJSON.stringify(input), expected);
}

// Basic values
test('number', stringify, 42, '42');
test('negative number', stringify, -42, '-42');
test('string', stringify, 'woo!!!', '"woo!!!"');
test('boolean', stringify, true, 'true');
test('null', stringify,  null, 'null');

// Special Values
test.skip('negative zero', stringify, -0, '{"$numberDecimal":"-0"}');
test.skip('undefined', stringify, undefined, '{"$undefined":true}');
test.skip('NaN', stringify, NaN, '{"$numberDecimal":"NaN"}');
test.skip('Infinity', stringify, Infinity, '{"$numberDecimal":"Infinity"}');
test.skip('Infinity', stringify, -Infinity, '{"$numberDecimal":"-Infinity"}');
test.skip('RegExp', stringify, /regexp/img, '{"$regex":"regexp","$options":"gim"}');
test.skip('Date', stringify, new Date(1e12), '{"$date":"2001-09-09T01:46:40.000Z"}');
test.skip('Symbol', stringify, Symbol('a'), '{"$symbol":"a"}');

// Objects
test('Array', stringify, ['a', 'b', 'c'], '["a","b","c"]');
test('Array (empty)', stringify, [], '[]');
// test('Array (sparse)', stringify, [ ,'b', ,], '[null,"b",null]');
test('Object', stringify, {foo: 'bar', 'x-y': 'z'}, '{"foo":"bar","x-y":"z"}');
test.skip('Set', stringify, new Set([1, 2, 3]), '{"$set":[1,2,3]}');
test.skip('Map', stringify, new Map([['a', 'b']]), '{"$map":[["a","b"]]}');

// Objects with Specials
test.skip('Array', stringify, ['a', new Date(1e12), 'c'], '["a",{"$date":"2001-09-09T01:46:40.000Z"},"c"]');
test.skip('Object', stringify, 
  { foo: 'bar', 'x-y': new Date(1e12)},
  '{"foo":"bar","x-y":{"$date":"2001-09-09T01:46:40.000Z"}}');
test.skip('Set', stringify, new Set([1, new Date(1e12), 3]), '{"$set":[1,{"$date":"2001-09-09T01:46:40.000Z"},3]}');
test.skip('Map', stringify, new Map([['a', new Date(1e12)]]), '{"$map":[["a",{"$date":"2001-09-09T01:46:40.000Z"}]]}');

test.skip('Object ( cyclical)', t => {
  const self: any = {};
  self.a = self;
  stringify(t, self, '{"a":{"$ref":"#"}}');
});

test.skip('Array (cyclical)', t => {
  const arr: any[] = [];
  arr[0] = arr;
  stringify(t, arr, '{"a":{"$ref":"#"}}');
});

test.skip('Map (cyclical)', t => {
  const map = new Map();
  map.set('self', map);
  stringify(t, map, '{"$map":[["self",{"$ref":"#"}]]}');
});

test.skip('Map (cyclical)', t => {
  const set = new Set();
  set.add(set);
  set.add(42);
  stringify(t, set, '{"$set":[{"$ref":"#"},42]}');
});

test.skip('deep', t => {
  const obj = {
    string: 'a_string',
    number: 42,
    decimal: 42.3,
    array: ['a_string', 42, 42.3],
    object: {
      'also a string': 'string',
      'a number': 42
    }
  };

  t.snapshot(AJSON.stringify(obj));
});

test.skip('references', t => {
  const a: any = {a: 1, b: {}};
  a.c = a.b;
  stringify(t, a, '{"a":1,"b":{},"c":{"$ref":"#/b"}}');

  const b: any = {a: 1, b: { c: {} }};
  b.c = b.b.c;
  stringify(t, b, '{"a":1,"b":{"c":{}},"c":{"$ref":"#/b/c"}}');
});
