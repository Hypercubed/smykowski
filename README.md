# AJSON

Advanced JSON. Like `JSON.stringify` with plug-ins.

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

In `ajson` we have a concept of encoders, decoders, and plugins.  Encoders and decoders are functions that take no arguments and return a "replacer" or "reviver" function with the signature `(value: any, path: Array<string | number>, next: Function)`.  In encoders the "replacer" function should return the encoded JS object that will continue to be processed by additional plugins.  For decoders the "reviver" function returns the decoded JS object.  The `path` value and the `next` callback are used to act recursively.

For example, a simple encoder that replaces all values that are not arrays with `"foo"`:

```ts
const foo = () => {
  const FOO = 'foo';
  return value => {
    return Array.isArray(value) ? v : FOO;
  };
};
```

A plugin that recurses arrays:

```ts
const recurseArrays = () => {
  return (value, path, next) => {
    if (Array.isArray(value)) return value.map((v, i) => next(v, [...path, i]));
    return v;
  };
};
```

Note the use of the `next` callback to update nested values recursively.  The order of the plugins does matter.  In this case `recurseArrays` should come before `foo`:

```ts
const asjon = new AJSON()
  .addEncoder(recurseArrays)
  .addEncoder(foo);

asjon.stringify([1, 2, 3]);
```

yields:

```json
["foo","foo","foo"]
```

Decoders work similarly using the `addDecoder` method.  A plugin is just a set of encoders and/or decoders like so:

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

## Supplied plugins

### `defaultEncoders`

* `jsonPointer`: Replaces cycles and repeated objects with [JSON Pointers](https://tools.ietf.org/html/rfc6901).
* `recurseObjects`: Recurses plain JS objects.
* `recurseArrays`: Recurses plain JS arrays.
* `recurseMap`: Recurses plain Maps returning the result in the form of `{ $map: [[...]] }`
* `recurseSet`: Recurses plain Sets returning the result in the form of `{ $set: [...] }`
* `specialNumbers`: Returns special numeric values (`-0`, `NaN` and +/-`Infinity`) as a strict [MongoDB Extended JSON numberDecimal](https://docs.mongodb.com/manual/reference/mongodb-extended-json/#numberdecimal) (`{ $numberDecimal: "..." }`).
* `undefinedValue`: Returns undefined values as a strict [MongoDB Extended JSON undefined](https://docs.mongodb.com/manual/reference/mongodb-extended-json/#undefined-type) (`{ $undefined: true }`).
* `regexpValue`: Returns regular expression values as a strict [MongoDB Extended JSON Regular Expressions](https://docs.mongodb.com/manual/reference/mongodb-extended-json/#regular-expression) (`{ "$regex": "...", "$options": "..." }`).
* `dateValue`: Returns dates as a strict [MongoDB Extended JSON Regular Date](https://docs.mongodb.com/manual/reference/mongodb-extended-json/#date) (`{ "$date": "..." }`).
* `symbolValue`: Returns symbols in the form of `{ $symbol: "..." }`

### `defaultDecoders`

* `recurseObjects`:
* `recurseObjects`:
* `recurseArrays`:
* `decodeSpecialNumbers`:
* `decodeUndefinedValue`:
* `decodeRegexValue`:
* `decodeDateValue`:
* `decodeSymbolValue`:
* `recurseDecodeMap`:
* `recurseDecodeSet`:
* `decodeBufferValue`:
* `decodeJSONPointers`:

## Alternatives

* [devalue](https://github.com/Rich-Harris/devalue) by Rich Harris
* [arson](https://github.com/benjamn/arson) by Ben Newman
* [eson](https://github.com/tj/eson) by TJ Holowaychuk

## License

This project is licensed under the MIT License - see the LICENSE file for details
