import * as express from 'express';
import { route, httpGet, httpPost } from '../decorators/route';
import { Base } from './index';
import { Employee } from '../models';
import {
  Response,
  Status,
} from '../models/response/index';
import { Stats } from 'fs';

@route('/home')
export class HomePage implements Base {

  @httpGet('/something')
  async sampleHome(str:number): Promise<Response> {

    const resStatus = new Status(true);
    const simpleResponse = new Response(resStatus);
    const emp = await Employee.findById(1);
    simpleResponse.result = emp;
    return simpleResponse;
  }

}
