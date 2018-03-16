import { 
  AJSON,
  defaultEncoders,
  defaultDecoders
} from '..';

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

const parsed = asjon.parse(stringified);
console.log(parsed);
