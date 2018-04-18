import { route, httpGet, httpPost, httpDelete, httpPut } from '../decorators/route';
import { Base } from './index';
import { Employee, Response } from '../models';
import { uiResponseService } from '../services';

@route('/employees')
export class HomePage implements Base {

  @httpPost('/', {
    required: ['employee'],
    validate: ['employee'],
  })
  async create(employee: Employee): Promise<Response> {
    try {
      const emp = await employee.save();
      return uiResponseService.createValidResponse(emp);
    } catch (e) {
      return uiResponseService.create500Response(e);
    }
  }

  @httpPut('/:id', {
    required: ['employee'],
    validate: ['employee'],
  })
  async update(id: number, data: Employee): Promise<Response> {
    const employee = await Employee.findById(id);
    if (!employee) {
      return uiResponseService.create404Response();
    }
    try {
      const emp = await Object.assign(employee, data).save();
      return uiResponseService.createValidResponse(emp);
    } catch (e) {
      return uiResponseService.create500Response(e);
    } 
  }

  @httpGet('/:id')
  async findById(id: number): Promise<Response> {
    const employee = await Employee.findById<Employee>(id);
    if (!employee) {
      return uiResponseService.create404Response();
    }
    return uiResponseService.createValidResponse(employee);
  }


  @httpDelete('/:id')
  async deleteById(id: number): Promise<Response> {
    const employee = await Employee.findById<Employee>(id);
    if (!employee) {
      return uiResponseService.create404Response();
    }
    const isSuccess = await employee.delete();
    return uiResponseService.createValidResponse();
  }
}
