import { test } from 'ava';

import { 
  Smykowski,
  defaultEncoders,
  defaultDecoders,
  classSerializer
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
  static fromJSON(obj) {
    const [first, last] = obj.name.split(' ');
    const e = new Employee(first, last, obj.startDate);
    return e;
  }

  constructor(first: string, last: string, public startDate: Date) {
    super(first, last);
  }

  toJSON() {
    return {
      name: this.getFullname(),
      startDate: this.startDate,
    };
  }
}

class Manager extends Employee {
  static fromJSON(obj) {
    const [first, last] = obj.name.split(' ');
    const e = new Manager(first, last, obj.startDate);
    e.employees = obj.employees;
    return e;
  }

  employees: Person[] = [];

  constructor(first: string, last: string, public startDate: Date) {
    super(first, last, startDate);
  }

  toJSON() {
    return {
      name: this.getFullname(),
      startDate: this.startDate,
      employees: this.employees
    };
  }
}

const ajson = new Smykowski()
  .use(classSerializer, { Person, Employee, Manager })
  .use(defaultEncoders)
  .use(defaultDecoders);

const john = new Employee('John', 'Doe', new Date('2001-09-09T01:46:40.000Z'));
const jane = new Manager('Jane', 'Doe', new Date('2001-09-09T01:46:40.000Z'));

jane.employees.push(john);

test('Default encoding, encodes enumerable values', t => {
  const person = new Person('John', 'Doe');

  Object.defineProperty(person, 'age', { enumerable: false, value: 42 });

  t.deepEqual(ajson.encode(person), {
    '@@Person': {
      first: 'John',
      last: 'Doe'
    }
  });
});

test('Decode assigns values', t => {
  const personJson = {
    '@@Person': {
      first: 'John',
      last: 'Doe',
      age: 42
    }
  };

  const person = ajson.decode(personJson);

  t.truthy(person instanceof Person);
  t.deepEqual({...person}, {
    first: 'John',
    last: 'Doe',
    age: 42
  });
});

test('Doesn\'t decode without prefix' , t => {
  const personJson = {
    Person: {
      first: 'John',
      last: 'Doe'
    }
  };

  const person = ajson.decode(personJson);

  t.falsy(person instanceof Person);
  t.deepEqual(person, {
    Person: {
      first: 'John',
      last: 'Doe',
    },
  });
});

test('Doesn\'t decode unknown classes' , t => {
  const personJson = {
    '@@Customer': {
      first: 'John',
      last: 'Doe'
    }
  };

  const person = ajson.decode(personJson);

  t.falsy(person instanceof Person);
  t.deepEqual(person, {
    '@@Customer': {
      first: 'John',
      last: 'Doe',
    },
  });
});

test('Encode using toJSON', t => {
  t.deepEqual(ajson.encode(john), {
    '@@Employee': {
      name: 'John Doe',
      startDate: { $date: '2001-09-09T01:46:40.000Z' }
    }
  });
});

test('Decode using fromJSON', t => {
  const johnJson = { 
    '@@Employee': {
      name: 'John Doe',
      startDate: { $date: '2001-09-09T01:46:40.000Z' }
    }
  };

  const johnDecoded = ajson.decode(johnJson);

  t.truthy(johnDecoded instanceof Employee);
  t.truthy(johnDecoded.startDate instanceof Date);
  t.deepEqual(johnDecoded, john);
});

test('Encode, nested', t => {
  t.deepEqual(ajson.encode(jane), {
    '@@Manager': {
      startDate: { $date: '2001-09-09T01:46:40.000Z' },
      employees: [
        {
          '@@Employee': {
            name: 'John Doe',
            startDate: { $date: '2001-09-09T01:46:40.000Z' }
          } 
        }
      ],
      name: 'Jane Doe',
    }
  });
});

test('Decode nested', t => {
  const janeJSON = { 
    '@@Manager': {
      employees: [
        {
          '@@Employee': {
            name: 'John Doe',
            startDate: { $date: '2001-09-09T01:46:40.000Z' }
          }
        }
      ],
      name: 'Jane Doe',
      startDate: { $date: '2001-09-09T01:46:40.000Z' }
    }
  };

  const janeDecoded = ajson.decode(janeJSON);

  t.truthy(janeDecoded instanceof Manager);
  t.truthy(janeDecoded.startDate instanceof Date);
  t.truthy(janeDecoded.employees[0] instanceof Employee);
  t.deepEqual(janeDecoded, jane);
  t.deepEqual(janeDecoded.employees[0], john);
});

test('There and back', t => {
  const str = ajson.stringify([
    john, 
    jane
  ], undefined, 2);

  const [ person, employee ] = ajson.parse(str) as [Person, Employee];

  t.true(person instanceof Person); // true
  t.true(employee instanceof Employee); // true
  t.true(employee.startDate instanceof Date); // true
  t.deepEqual(employee.getFullname(), 'Jane Doe');
});
