import { IResponse } from '../../interfaces/models';
import { Base } from '../index';
import{ Status } from './status';

export class Response implements IResponse{
  status: Status;
  result: Base;   
  constructor(status?:Status, result?: Base) {
    if (status) {
      this.status = status;
    }
    if (result) {
      this.result = result;
    }
  } 
}

export * from './status';
export * from './error';
