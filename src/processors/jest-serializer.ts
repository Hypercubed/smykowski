import { Path, IGet } from '../types';

export const jestSerializer = () => jestReplacer;

/* 
  Code below is from jest, with small modifications
  https://github.com/facebook/jest/blob/master/packages/jest-serializer/src/__tests__/index.test.js
  Copyright (c) 2018-present, Facebook, Inc.
*/

const JS_TYPE = '__$t__';
const JS_VALUE = '__$v__';
const JS_VF = '__$f__';

function jestReplacer(value: any, path: Path, decend: IGet): any {
  // NaN cannot be in a switch statement, because NaN !== NaN.
  if (Number.isNaN(value)) {
    return {[JS_TYPE]: 'n'};
  }

  switch (value) {
    case undefined:
      return {[JS_TYPE]: 'u'};

    case +Infinity:
      return {[JS_TYPE]: '+'};

    case -Infinity:
      return {[JS_TYPE]: '-'};
  }

  switch (value && value.constructor) {
    case Date:
      return {[JS_TYPE]: 'd', [JS_VALUE]: value.getTime()};

    case RegExp:
      return {[JS_TYPE]: 'r', [JS_VALUE]: value.source, [JS_VF]: value.flags};

    case Set:
      return {[JS_TYPE]: 's', [JS_VALUE]: decend(Array.from(value), path)};

    case Map:
      return {[JS_TYPE]: 'm', [JS_VALUE]: decend(Array.from(value), path)};

    case Buffer:
      return {[JS_TYPE]: 'b', [JS_VALUE]: value.toString('latin1')};
  }

  return value;
}
