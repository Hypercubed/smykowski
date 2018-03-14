# AJSON

Advanced JSON. Like `JSON.stringify` with plugins.

## Usage

```js
import { 
  AJSON,
  jsonPointer,
  recurseObjects, recurseArrays,
  specialNumbers, dateValue, symbolValue
} from 'ajson';

const asjon = new AJSON()
  .addProcessor(jsonPointer)
  .addProcessor(recurseObjects)
  .addProcessor(recurseArrays)
  .addProcessor(specialNumbers)
  .addProcessor(dateValue)
  .addProcessor(symbolValue);

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

asjon.stringify(obj, null, 2);
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
    },
    {
      "$ref": "#"
    },
    {
      "$ref": "#/friends/[0]"
    }
  ]
}
```

## Plugins

Plugins are functions that take no arguments and return a "replacer" function with the signature `(value: any, path: Array<string | number>, next: Function)`.  The "replacer" function should return the encode JS object that will continue to be processed by addional plugins.  The `path` value and the `next` callback are used to act recusivly.

For example, a simple plugin that replaces all values thar are not arrays with `"foo"`:

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

const recurseArrays = () => {
Note the use of the `next` callback to update nested values recursively.  The order of the plugins does matter.  In this case `recurseArrays` should come before `foo`:

```ts
const asjon = new AJSON()
  .addProcessor(recurseArrays)
  .addProcessor(foo);

asjon.stringify([1, 2, 3]);
```

yeilds:

```json
["foo","foo","foo"]
```

## Supplied plugins

* `jsonPointer`: Replaces cycles and repeated objects with [JSON Pointers](https://tools.ietf.org/html/rfc6901).
* `recurseObjects`: Recurses plain JS objects.
* `recurseArrays`: Recurses plain JS arrays.
* `recurseMap`: Recurses plain Maps returing the result in the form of `{ $map: [[...]] }`
* `recurseSet`: Recurses plain Sets returing the result in the form of `{ $set: [...] }`
* `specialNumbers`: Returns special numeric values (`-0`, `NaN` and +/-`Infinity`) as a strict [MongoDB Extended JSON numberDecimal](https://docs.mongodb.com/manual/reference/mongodb-extended-json/#numberdecimal) (`{ $numberDecimal: "..." }`).
* `undefinedValue`: Returns undefined values as a strict [MongoDB Extended JSON undefined](https://docs.mongodb.com/manual/reference/mongodb-extended-json/#undefined-type) (`{ $undefined: true }`).
* `regexpValue`: Returns regular expression values as a strict [MongoDB Extended JSON Regular Expressions](https://docs.mongodb.com/manual/reference/mongodb-extended-json/#regular-expression) (`{ "$regex": "...", "$options": "..." }`).
* `dateValue`: Returns dates as a strict [MongoDB Extended JSON Regular Date](https://docs.mongodb.com/manual/reference/mongodb-extended-json/#date) (`{ "$date": "..." }`).
* `symbolValue`: Returns symbols in the form of `{ $symbol: "..." }`

## Alternatives

* [devalue](https://github.com/Rich-Harris/devalue) by Rich Harris
* [arson](https://github.com/benjamn/arson) by Ben Newman
* [eson](https://github.com/tj/eson) by TJ Holowaychuk

## License

This project is licensed under the MIT License - see the LICENSE file for details
