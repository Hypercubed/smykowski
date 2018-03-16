export class Person {
  static fromJSON(obj) {
    const [first, last] = obj['@@Person'].split(' ');
    return new Person(first, last);
  }

  dob = new Date(1e12);

  constructor(public first: string, public last: string) {
  }

  toJSON() {
    return {
      '@@Person': `${this.first} ${this.last}`,
      dob: this.dob
    };
  }
}

export const person = new Person('Benton', 'Chase');
