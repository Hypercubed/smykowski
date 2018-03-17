import { AJSON } from './ajson';
import { 
  jsonPointer,
  // recurseObjects, recurseArrays,
  encodeMap, encodeSet,
  specialNumbers, undefinedValue, regexpValue, dateValue,
  symbolValue, toJSON, bufferValue
} from './encoders';
import {
  decodeSpecialNumbers, decodeSymbolValue, decodeMap, decodeSet, decodeBufferValue, 
  decodeUndefinedValue, decodeRegexValue, decodeDateValue,
  decodeJSONPointers
} from './decoders';

export function defaultEncoders(ajson: AJSON): AJSON {
  return ajson
    .addEncoder(jsonPointer)
    .addEncoder(bufferValue)
    .addEncoder(specialNumbers)
    .addEncoder(undefinedValue)
    .addEncoder(regexpValue)
    .addEncoder(dateValue)
    .addEncoder(symbolValue)
    .addEncoder(encodeMap)
    .addEncoder(encodeSet)
    .addEncoder(toJSON);
}

export function defaultDecoders(ajson: AJSON): AJSON {
  return ajson
    .addDecoder(decodeSpecialNumbers)
    .addDecoder(decodeUndefinedValue)
    .addDecoder(decodeRegexValue)
    .addDecoder(decodeDateValue)
    .addDecoder(decodeSymbolValue)
    .addDecoder(decodeBufferValue)
    .addDecoder(decodeMap)
    .addDecoder(decodeSet)
    .addDecoder(decodeJSONPointers);
}
