export class Person {
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
