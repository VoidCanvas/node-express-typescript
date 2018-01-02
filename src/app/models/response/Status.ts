import { IStatus } from '../../interfaces/models';

export class Status implements IStatus{
  error: Error;
  isSuccessful: boolean;  
  constructor(isSuccessful?:boolean, error?:Error) {
    this.isSuccessful = isSuccessful;
    this.error = error;
  }
}
