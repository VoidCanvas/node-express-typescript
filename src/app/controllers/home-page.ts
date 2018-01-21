import * as express from 'express';
import { route, httpGet, httpPost } from '../decorators/route';
import { Base } from './index';
import {
  Response,
  Status,
} from '../models/response/index';
import { Stats } from 'fs';

@route('/home')
export class HomePage implements Base {

  @httpGet('/something')
  async sampleHome(req: express.Request, res: express.Response): Promise<Response> {

    const resStatus = new Status(true);
    const simpleResponse = new Response(resStatus);
    
    return simpleResponse;
  }

}
