import { AJSON } from './ajson';
import { 
  encodeJSONPointer,
  encodeMap, encodeSet,
  encodeSpecialNumbers, encodeUndefined, encodeRegexps, encodeDates,
  encodeSymbols, toJSON, encodeBuffers
} from './encoders';
import {
  decodeSpecialNumbers, decodeSymbols, decodeMap, decodeSet, decodeBuffers, 
  decodeUndefined, decodeRegexps, decodeDates,
  decodeJSONPointers
} from './decoders';

export function defaultEncoders(ajson: AJSON): AJSON {
  return ajson
    .addEncoder(encodeJSONPointer)
    .addEncoder(encodeBuffers)
    .addEncoder(encodeSpecialNumbers)
    .addEncoder(encodeUndefined)
    .addEncoder(encodeRegexps)
    .addEncoder(encodeDates)
    .addEncoder(encodeSymbols)
    .addEncoder(encodeMap)
    .addEncoder(encodeSet)
    .addEncoder(toJSON);
}

export function defaultDecoders(ajson: AJSON): AJSON {
  return ajson
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
