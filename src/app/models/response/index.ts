import { IResponse } from '../../interfaces/models';
import { Base } from '../index';
import{ Status } from './status';

export class Response extends Base implements IResponse {
  status: Status;
  result: any;   
  constructor(status?:Status, result?: Base) {
    super();
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
