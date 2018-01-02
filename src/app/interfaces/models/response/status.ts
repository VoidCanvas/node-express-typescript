import {
  IBase,
} from '../index';
export interface IStatus extends IBase{
  error: Error;
  isSuccessful: boolean;
}


