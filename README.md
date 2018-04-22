# Smykowski

*I deal with the goddamn objects so JSON doesn’t have to!! I have object skills!!*

## Install

```bash
npm i smykowski
```

## The Story

![](https://i.imgflip.com/26xqmj.jpg)

So what you do is you take the JavaScript objects and you pass them down to the JSON?

*That, that's right.*

Well, then I gotta ask, then why can't the objects go directly to JSON, huh?

*Well, uh, uh, uh, because, uh, JSON is not good at dealing with some objects.*

You convert the JS objects for JSON?

*Well, no, my, my plugins do that, or, or your plugins do.*

Ah. Then you must then convert the JSON back to objects.

*Well...no. Yeah, I mean, sometimes.*

Well, what would you say… you do here?

*Well, look, I already told you. I deal with the goddamn objects so 
JSON doesn’t have to!! I have object skills!! I am good at 
dealing with objects!!! Can't you understand that?!? WHAT THE HELL IS 
WRONG WITH YOU PEOPLE?!!!!!!!*

## Usage

```js
import {  Smykowski, defaultEncoders, defaultDecoders } from 'smykowski';

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

In `Smykowski` we have a concept of encoders, decoders, and plugins.  Encoders and decoders are functions that take no arguments and return a "replacer" or "reviver" function with the signature `(value: any, path: Array<string | number>)`.  For encoders the "replacer" function should return the encoded JS object that will continue to be processed by additional plugins.  For decoders the "reviver" function returns the decoded JS object.  The `path` value may be user to write more advanced encoders/decoders.

For example, a very simple encoder that replaces all values that are not arrays with `"foo"`:

```ts
const foo = () => {
  const FOO = 'foo';
  return value => {
    return Array.isArray(value) ? v : FOO;
  };
};
```

A more complex examples is an encoder that replaces duplicate values with JSON pointers:

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
const asjon = new Smykowski()
  .addEncoder(foo)
  .addEncoder(jsonPointer);

const arr = [1, 2, 3];
asjon.stringify([arr, arr]);
```

yields:

```json
[["foo","foo","foo"],{"$ref":"foo"}]
```

Decoders work similarly using the `addDecoder` method.  A plug-in is a set of encoders and/or decoders like so:

```ts
function myPlugin(_: Smykowski) {
  return _
    .addEncoder(recurseArrays)
    .addEncoder(foo)
    .addDecoder(myDecoder);
}

const asjon = new Smykowski()
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
* `stableObject`: Sorts object properties by key (get a consistent hash from objects)

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

### `classSerializer`

This plugin registers classes for encoding/decoding using typed hints.  For example:

```ts
class Person {
  constructor(public first: string, public last: string) {

  }

  getFullname() {
    return this.first + ' ' + this.last;
  }
}

class Employee extends Person {
  constructor(public first: string, public last: string, public id: string) {
    super(first, last);

  }
}

const ajson = new Smykowski()
  .use(classSerializer, { Person, Employee })
  .use(defaultEncoders)
  .use(defaultDecoders);

const str = ajson.stringify([new Person('John', 'Doe'), new Employee('Jane', 'Doe', 'A123')]);
/*
  [
    {
      "@@Person": {
        "first": "John",
        "last": "Doe"
      }
    },
    {
      "@@Employee": {
        "first": "Jane",
        "id": "A123",
        "last": "Doe"
    }
  ]
*/

const [ john, jane ] = ajson.parse(str) as [Person, Employee];

john instanceof Person; // true
jane instanceof Employee; // true
jane.getFullname(); // "Jane Doe"
```

## Alternatives

* [Rich-Harris/devalue](https://github.com/Rich-Harris/devalue)
* [benjamn/arson](https://github.com/benjamn/arson)
* [tj/eson](https://github.com/tj/eson)
* [substack/json-stable-stringify](https://github.com/substack/json-stable-stringify)
* [JohnWeisz/TypedJSON](https://github.com/JohnWeisz/TypedJSON)

## License

This project is licensed under the MIT License - see the LICENSE file for details
