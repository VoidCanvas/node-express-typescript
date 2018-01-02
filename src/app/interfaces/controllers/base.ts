import {
  IResponse,
} from '../models/response';

export interface IBase {
    
}

export interface IRequestHandler{
  (
    req:Express.Request,
    res: Express.Response,
  ): Promise<IResponse>;
}


