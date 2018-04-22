import { Smykowski } from './smykowski';
import { 
  encodeJSONPointer,
  encodeMap, encodeSet,
  encodeSpecialNumbers, encodeUndefined, encodeRegexps, encodeDates,
  encodeSymbols, toJSON, encodeBuffers, stableObject, classEncoder
} from './encoders';
import {
  decodeSpecialNumbers, decodeSymbols, decodeMap, decodeSet, decodeBuffers, 
  decodeUndefined, decodeRegexps, decodeDates,
  decodeJSONPointers, classDecoder
} from './decoders';
import { Constructor } from './types';

export function defaultEncoders(_: Smykowski): Smykowski {
  return _
    .addEncoder(encodeJSONPointer)
    .addEncoder(encodeBuffers)
    .addEncoder(encodeSpecialNumbers)
    .addEncoder(encodeUndefined)
    .addEncoder(encodeRegexps)
    .addEncoder(encodeDates)
    .addEncoder(encodeSymbols)
    .addEncoder(encodeMap)
    .addEncoder(encodeSet)
    .addEncoder(toJSON)
    .addEncoder(stableObject);
}

export function defaultDecoders(_: Smykowski): Smykowski {
  return _
    .addDecoder(decodeSpecialNumbers)
    .addDecoder(decodeUndefined)
    .addDecoder(decodeRegexps)
    .addDecoder(decodeDates)
    .addDecoder(decodeSymbols)
    .addDecoder(decodeBuffers)
    .addDecoder(decodeMap)
    .addDecoder(decodeSet)
    .addDecoder(decodeJSONPointers);
}

export function classHints(_: Smykowski, constuctors: { [x: string]: Constructor }): Smykowski {
  return _
    .addEncoder(classEncoder, constuctors)
    .addDecoder(classDecoder, constuctors);
}
