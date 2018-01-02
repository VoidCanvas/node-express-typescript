import {
  IBase,
} from '../index';

export interface IError extends IBase {
  code: number;
  message: string;
  extra:any;
}


