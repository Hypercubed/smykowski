export declare class Person {
    first: string;
    last: string;
    dob: Date;
    constructor(first: string, last: string);
    toJSON(): {
        '@@Person': string;
        dob: Date;
    };
}
export declare const person: Person;
