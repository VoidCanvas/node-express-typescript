import {
  IBase,
} from '../index';
import { IStatus } from './status';
export interface IResponse extends IBase{
  status: IStatus;
  result: IBase;
}

export * from './error';
export * from './status';

