import { AJSON } from './ajson';
import { 
  jsonPointer,
  recurseObjects, recurseArrays, recurseMap, recurseSet,
  specialNumbers, undefinedValue, regexpValue, dateValue,
  symbolValue, toJSON, bufferValue
} from './processors';

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
