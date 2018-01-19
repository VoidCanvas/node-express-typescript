import * as express from 'express';
import {
  Base,
} from './index';
import {
  Response,
  Status,
} from '../models/response/index';
import { Stats } from 'fs';

export class HomePage implements Base {
  async simpleHome(req: Express.Request, res: express.Response): Promise<Response> {

    const resStatus = new Status(true);
    const simpleResponse = new Response(resStatus);
    
    return simpleResponse;
  }

}
