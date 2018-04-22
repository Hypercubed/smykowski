import { test } from 'ava';

import { 
  Smykowski,
  defaultEncoders,
  defaultDecoders,
  classHints
} from '../';
import { create } from 'domain';

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
  .use(classHints, { Person, Employee })
  .use(defaultEncoders)
  .use(defaultDecoders);

const p = {
  first: 'John',
  last: 'Doe'
};

const e = {
  first: 'John',
  last: 'Doe',
  id: 'A123'
};

test('Hints', t => {
  const people = [new Person('John', 'Doe'), new Employee('John', 'Doe', 'A123')];

  t.deepEqual(ajson.encode(people), [
    { '@@Person': p },
    { '@@Employee': e }
  ]);
});

test('Hints Decode', t => {

  const people = [
    { '@@Person': p },
    { '@@Employee': e }
  ];

  const d = ajson.decode(people);

  t.truthy(d[0] instanceof Person);
  t.truthy(d[1] instanceof Employee);
  t.deepEqual({...d[0]}, p);
  t.deepEqual({...d[1]}, e);
});

test('readme', t => {
  const str = ajson.stringify([
    new Person('John', 'Doe'), 
    new Employee('Jane', 'Doe', 'A123')
  ], undefined, 2);

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

  t.snapshot(str);

  const [ john, jane ] = ajson.parse(str) as [Person, Employee];

  t.true(john instanceof Person); // true
  t.true(jane instanceof Employee); // true
  t.deepEqual(jane.getFullname(), 'Jane Doe');
});
