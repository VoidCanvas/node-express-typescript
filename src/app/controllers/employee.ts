import * as express from 'express';
import { route, httpGet, httpPost } from '../decorators/route';
import { Base } from './index';
import { Employee } from '../models';
import {
  Response,
  Status,
} from '../models/response/index';
import { Stats } from 'fs';

@route('/employees')
export class HomePage implements Base {

  @httpPost('/')
  async create(data: Employee): Promise<Response> {
    const employee = data ? data : new Employee();
    const validation = await employee.validate();
    if (!validation.isValid) {
      const resStatus = new Status(false);
      resStatus.error = validation;
      const simpleResponse = new Response(resStatus);
      return simpleResponse;
    }
    try {
      const emp = await employee.save();
      const resStatus = new Status(true);
      const simpleResponse = new Response(resStatus);
      simpleResponse.result = emp;
      return simpleResponse;
    } catch (e) {
      const resStatus = new Status(false, e);
      const simpleResponse = new Response(resStatus);
      return simpleResponse;
    }
    
  }
}
