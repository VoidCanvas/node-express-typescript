import { IStatus } from '../../interfaces/models';
import { Validation } from '../Index';

export class Status implements IStatus{
  error: Error|Validation;
  isSuccessful: boolean;  
  constructor(isSuccessful?:boolean, error?: Error|Validation) {
    this.isSuccessful = isSuccessful;
    this.error = error;
  }
}
