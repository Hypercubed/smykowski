import { test } from 'ava';

import { Smykowski, defaultDecoders } from '..';
import { Person } from './fixtures/person';

export const decodePerson = () => {
  return (v: any, path) => {
    if (v && typeof v['@@Person'] === 'string') {
      return Person.fromJSON(v);
    }
    return v;
  };
};

const asjon = new Smykowski()
  .use(defaultDecoders)
  .addDecoder(decodePerson);

test('fromJSON', t => {
  const p = new Person('Benton', 'Chase');
  t.deepEqual(asjon.decode({
    '@@Person': 'Benton Chase',
    dob: { $date: '2001-09-09T01:46:40.000Z' }
  }), p);
});
