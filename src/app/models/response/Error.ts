import { IError } from '../../interfaces/models';

export class Error implements IError{
  code: number;
  message: string;
  extra: any;    
}
