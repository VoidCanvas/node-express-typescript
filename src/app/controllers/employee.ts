import * as express from 'express';
import { route, httpGet, httpPost, httpDelete, httpPut } from '../decorators/route';
import { Base } from './index';
import { Employee, Validation } from '../models';
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

  @httpPut('/:id')
  async update(id: number, data: Employee): Promise<Response> {
    const employee = await Employee.findById(id);
    if (!employee) {
      const resStatus = new Status(true);
      resStatus.error = new Validation();
      resStatus.error.message =  'Not found'; 
      resStatus.error.code =  404; 
      const simpleResponse = new Response(resStatus);
      return simpleResponse;
    }

    const validation = await data.validate();
    if (!validation.isValid) {
      const resStatus = new Status(false);
      resStatus.error = validation;
      const simpleResponse = new Response(resStatus);
      return simpleResponse;
    }

    try {
      const emp = await Object.assign(employee, data).save();
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

  @httpGet('/:id')
  async findById(id: number): Promise<Response> {
    const employee = await Employee.findById(id);
    if (!employee) {
      const resStatus = new Status(true);
      resStatus.error = new Validation();
      resStatus.error.message =  'Not found'; 
      resStatus.error.code =  404; 
      const simpleResponse = new Response(resStatus);
      return simpleResponse;
    }
    const resStatus = new Status(true);
    const simpleResponse = new Response(resStatus);
    simpleResponse.result = employee;
    return simpleResponse; 
  }


  @httpDelete('/:id')
  async deleteById(id: number): Promise<Response> {
    const employee = await Employee.findById(id);
    if (!employee) {
      const resStatus = new Status(true);
      resStatus.error = new Validation();
      resStatus.error.message =  'Not found'; 
      resStatus.error.code =  404; 
      const simpleResponse = new Response(resStatus);
      return simpleResponse;
    }
    const isSuccess = await employee.delete();
    const resStatus = new Status(isSuccess);
    const simpleResponse = new Response(resStatus);
    return simpleResponse; 
  }
}
