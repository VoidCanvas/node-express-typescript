
import * as classValidator from 'class-validator';
import { Validation } from '../models';
export * from 'class-validator';
export const validate = async (obj:any): Promise<Validation> => {
  const validObj = new Validation();
  validObj.isValid = true;
  const errors = await classValidator.validate(obj);
  if (errors && errors.length) {
    validObj.isValid = false;
    errors.forEach(err => err.target = undefined);
    validObj.errors = errors;
  }
  return validObj;
};
