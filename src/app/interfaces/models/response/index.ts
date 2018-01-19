import {
  IBase,
} from '../index';
import { IStatus } from './status';
export interface IResponse {
  status: IStatus;
  result: IBase;
}

export * from './error';
export * from './status';

