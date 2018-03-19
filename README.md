# AJSON

Advanced JSON. Like `JSON.stringify` and `JSON.parse` with plug-ins.

## Usage

```js
import {  AJSON, defaultEncoders, defaultDecoders } from 'ajson';

const asjon = new AJSON()
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

const stringified = asjon.stringify(obj, null, 2);
console.log(stringified);
```

yields:

```json
{
  "_id": "5aa882d3638a0f580d92c677",
  "index": 0,
  "name": {
    "first": "Valenzuela",
    "last": "Valenzuela"
  },
  "registered": {
    "$date": "2014-01-01T07:00:00.000Z"
  },
  "symbol": {
    "$symbol": "banana"
  },
  "range": [
    {
      "$numberDecimal": "-Infinity"
    },
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    {
      "$numberDecimal": "Infinity"
    }
  ],
  "friends": [
    {
      "id": {
        "$numberDecimal": "-0"
      },
      "name": "Benton Chase"
    },
    {
      "id": 1,
      "name": "Mccarthy Morgan"
    },
    {
      "id": {
        "$numberDecimal": "NaN"
      },
      "name": "Kaufman Price"
    }
  ]
}
```

then

```ts
const parsed = asjon.parse(stringified);
console.log(parsed);
```

returns the a new object "equal" to the first.

## Plugins

In `ajson` we have a concept of encoders, decoders, and plugins.  Encoders and decoders are functions that take no arguments and return a "replacer" or "reviver" function with the signature `(value: any, path: Array<string | number>)`.  For encoders the "replacer" function should return the encoded JS object that will continue to be processed by additional plugins.  For decoders the "reviver" function returns the decoded JS object.  The `path` value may be user to write more advanced encoders/decoders.

For example, a very simple encoder that replaces all values that are not arrays with `"foo"`:

```ts
const foo = () => {
  const FOO = 'foo';
  return value => {
    return Array.isArray(value) ? v : FOO;
  };
};
```

A more complex eample is an encoder that replaces duplicate values with JSON pointers:

```ts
export const jsonPointer = () => {
  const repeated = new WeakMap();
  return (v, path: Path) => {
    if (v !== null && typeof v === 'object') {
      if (repeated.has(v)) {
        return { $ref: '#' + jsonpointer.compile(repeated.get(v)) };
      }
      repeated.set(v, path);
    }
    return v;
  };
};
```

The order of the plugins does matter.  In this case `jsonPointer` should come last:

```ts
const asjon = new AJSON()
  .addEncoder(foo)
  .addEncoder(jsonPointer);

const arr = [1, 2, 3];
asjon.stringify([arr, arr]);
```

yields:

```json
[["foo","foo","foo"],{"$ref":"foo"}]
```

Decoders work similarly using the `addDecoder` method.  A plugin is a set of encoders and/or decoders like so:

```ts
function myPlugin(_: AJSON) {
  return _
    .addEncoder(recurseArrays)
    .addEncoder(foo)
    .addDecoder(myDecoder);
}

const asjon = new AJSON()
  .use(myPlugin);
```

Note: `use(fn)` is sugar for `fn(asjon)`.

## Supplied plugins

### `defaultEncoders`

* `encodeJSONPointer`: Replaces cycles and repeated objects with [JSON Pointers](https://tools.ietf.org/html/rfc6901).
* `encodeBuffers`: Encodes buffers n the form of `{ $binary: '...' }` where the string is the Base64 encoded value.
* `encodeMap`: Encodes Maps returning the result in the form of `{ $map: [[...]] }`
* `encodeSet`: Encodes plain Sets returning the result in the form of `{ $set: [...] }`
* `encodeSpecialNumbers`: Returns special numeric values (`-0`, `NaN` and +/-`Infinity`) as a strict [MongoDB Extended JSON numberDecimal](https://docs.mongodb.com/manual/reference/mongodb-extended-json/#numberdecimal) (`{ $numberDecimal: "..." }`).
* `encodeUndefined`: Returns undefined values as a strict [MongoDB Extended JSON undefined](https://docs.mongodb.com/manual/reference/mongodb-extended-json/#undefined-type) (`{ $undefined: true }`).
* `encodeRegexps`: Returns regular expression values as a strict [MongoDB Extended JSON Regular Expressions](https://docs.mongodb.com/manual/reference/mongodb-extended-json/#regular-expression) (`{ "$regex": "...", "$options": "..." }`).
* `encodeDates`: Returns dates as a strict [MongoDB Extended JSON Regular Date](https://docs.mongodb.com/manual/reference/mongodb-extended-json/#date) (`{ "$date": "..." }`).
* `encodeSymbols`: Returns symbols in the form of `{ $symbol: "..." }`
* `toJSON`: Returns the result of the `toJSON` method for objects whose `toJSON` property is a function

### `defaultDecoders`

* `decodeSpecialNumbers`: Decodes special numeric values.
* `decodeUndefined`: Decodes `undefined`.
* `decodeRegexps`: Decodes `Regexp` values.
* `decodeDates`: Decodes `Date`s.
* `decodeSymbols`: Decodes `Symbol`s.
* `decodeMap`: Decodes `Map`s.
* `decodeSet`: Decodes `Set`s.
* `decodeBuffers`: Decodes `Buffer`.
* `decodeJSONPointers`: Decodes JSON pointers.

## Alternatives

* [devalue](https://github.com/Rich-Harris/devalue) by Rich Harris
* [arson](https://github.com/benjamn/arson) by Ben Newman
* [eson](https://github.com/tj/eson) by TJ Holowaychuk

## License

This project is licensed under the MIT License - see the LICENSE file for details
