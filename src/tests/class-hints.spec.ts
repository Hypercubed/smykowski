import { test } from 'ava';

import { 
  Smykowski,
  defaultEncoders,
  defaultDecoders,
  classSerializer
} from '../';
import { create } from 'domain';

class Address {
  constructor(public num: string, public street: string) {
  }
}

class Person {
  static fromJSON(obj) {
    const [first, last] = obj.name.split(' ');
    return new Person(first, last);
  }

  constructor(public first: string, public last: string) {
  }

  getFullname() {
    return this.first + ' ' + this.last;
  }

  toJSON() {
    return {
      name: this.getFullname()
    };
  }
}

class Employee extends Person {
  static fromJSON(obj) {
    const [first, last] = obj.name.split(' ');
    return new Employee(first, last, obj.dob);
  }

  constructor(first: string, last: string, public dob: Date) {
    super(first, last);
  }

  toJSON() {
    return {
      name: this.getFullname(),
      dob: this.dob
    };
  }
}

const ajson = new Smykowski()
  .use(classSerializer, { Person, Employee })
  .use(defaultEncoders)
  .use(defaultDecoders);

const john = new Person('John', 'Doe');
const jane = new Employee('Jane', 'Doe', new Date('2001-09-09T01:46:40.000Z'));

test('Hints', t => {
  const people = [
    john,
    jane,
    { Employee: { ...jane } }
  ];

  t.deepEqual(ajson.encode(people), [
    { '@@Person': { name: 'John Doe' } },
    { '@@Employee': { name: 'Jane Doe', dob: { $date: '2001-09-09T01:46:40.000Z' } } },
    { Employee: { ...jane } }
  ]);
});

test('Hints Decode', t => {

  const people = [
    { '@@Person': { name: 'John Doe' } },
    { '@@Employee': { name: 'Jane Doe', dob: { $date: '2001-09-09T01:46:40.000Z' } } },
    { Employee: e }
  ];

  const [person, employee, obj] = ajson.decode(people);

  t.truthy(person instanceof Person);
  t.truthy(employee instanceof Employee);
  t.truthy(employee.dob instanceof Date);
  t.falsy(obj instanceof Employee);
  t.deepEqual({...person}, p);
  t.deepEqual({...employee}, e);
  t.deepEqual({...obj}, { Employee: { ...e } });
});

test('readme', t => {
  const str = ajson.stringify([
    new Person('John', 'Doe'), 
    new Employee('Jane', 'Doe', new Date(1e12))
  ], undefined, 2);

  t.deepEqual(str, `[
  {
    "@@Person": {
      "name": "John Doe"
    }
  },
  {
    "@@Employee": {
      "dob": {
        "$date": "2001-09-09T01:46:40.000Z"
      },
      "name": "Jane Doe"
    }
  }
]`);

  const [ john, jane ] = ajson.parse(str) as [Person, Employee];

  t.true(john instanceof Person); // true
  t.true(jane instanceof Employee); // true
  t.true(jane.dob instanceof Date); // true
  t.deepEqual(jane.getFullname(), 'Jane Doe');
});
