import { AJSON } from './ajson';
import { 
  jsonPointer,
  recurseObjects, recurseArrays, recurseMap, recurseSet,
  specialNumbers, undefinedValue, regexpValue, dateValue,
  symbolValue, toJSON, bufferValue
} from './encoders';
import {
  decodeSpecialNumbers, decodeSymbolValue, recurseDecodeMap, decodeBufferValue, recurseDecodeSet, 
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
    .addEncoder(recurseObjects)
    .addEncoder(recurseArrays)
    .addEncoder(recurseMap)
    .addEncoder(recurseSet)
    .addEncoder(toJSON);
}

export function defaultDecoders(ajson: AJSON): AJSON {
  return ajson
    .addDecoder(recurseObjects)
    .addDecoder(recurseArrays)
    .addDecoder(decodeSpecialNumbers)
    .addDecoder(decodeUndefinedValue)
    .addDecoder(decodeRegexValue)
    .addDecoder(decodeDateValue)
    .addDecoder(decodeSymbolValue)
    .addDecoder(recurseDecodeMap)
    .addDecoder(recurseDecodeSet)
    .addDecoder(decodeBufferValue)
    .addDecoder(decodeJSONPointers);
}
