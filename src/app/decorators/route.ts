import * as express from 'express';
import { Base, Validation } from '../models';
import { Status, Response } from '../models/response/index';

import * as IControllers from '../interfaces/controllers';
import 'reflect-metadata';
import { stat } from 'fs';
import { uiResponseService } from '../services';
import { ValidationError } from 'class-validator';

let app:express.Application = null;
const ROUTE_METHOD_PATH_MAPPING:any = [];
const ROUTE_PATH_MAPPING = new Map(); 
const BASE_ROUTE = '/api';

/**
 * This is the general handler for each route. It calls the appropriate controller method with appropriate params
 * @param routeHandler gets the controller method to handle a route
 * @param modelMaping to parse the contract from the request
 * @param req request object
 * @param res response object
 */
function basicRequestHandler(routeHandler:any, modelMaping: any[], req:express.Request, res:express.Response): void {
  try {
    modelMaping.forEach((mmap) => {
      const obj = req.body[mmap.paramName] || req.query[mmap.paramName] || req.params[mmap.paramName];
      if (obj) {
        mmap.data = new mmap.modelSchema(obj).valueOf();
      }
    });
    Promise.all(modelMaping.map(mmap => validateModel(mmap)))
    .then((validatedModelMappings: any) => {
      const errors = validatedModelMappings.filter((mmap:any) => {
        return !mmap.isValid;
      }).map((mmap:any) => mmap.error);
      if (errors.length) {
        const response = uiResponseService.create400Response(errors);
        res.json(response);
      } else {
        routeHandler(...modelMaping.map(x => x.data))
        .then((response: Response) => {
          res.json(response);
        });
      }
    });
  } catch (e) {
    const response = uiResponseService.create500Response(e);
    res.json(response);
  }
}

async function validateModel(mmap:any) {
  mmap.isValid = true;
  mmap.error = {};
  if (mmap.isRequired && (mmap.data === undefined || mmap.data === null)) {
    mmap.error.message = `${mmap.paramName} is Required`;
    mmap.isValid = false;
  } else if (mmap.shouldValidate === true && mmap.data.validate) {
    const validation = await mmap.data.validate();
    if (!validation.isValid) {
      mmap.error.message = `${mmap.paramName} is not valid`;
      mmap.error.errors = validation.errors;
      mmap.isValid = false;      
    }
  }
  return mmap;
}

/**
 * One time call from while bootstrapping to setup the api routes
 */
function setupRoutes() {
  while (ROUTE_METHOD_PATH_MAPPING.length > 0) {
    const obj = ROUTE_METHOD_PATH_MAPPING.shift();
    const routeControllerConstructor = obj.controller && obj.controller.constructor;
    let path = (ROUTE_PATH_MAPPING.get(routeControllerConstructor)) ? ROUTE_PATH_MAPPING.get(routeControllerConstructor) : '';
    path = `${BASE_ROUTE}${path}${obj.path}`;
    switch (obj.method){
      case 'post':
        app.post(path, basicRequestHandler.bind(null, obj.routeHandler, obj.modelMapping));
        break;
      case 'put':
        app.put(path, basicRequestHandler.bind(null, obj.routeHandler, obj.modelMapping));
        break;
      case 'delete':
        app.delete(path, basicRequestHandler.bind(null, obj.routeHandler, obj.modelMapping));
        break;
      case 'patch':
        app.patch(path, basicRequestHandler.bind(null, obj.routeHandler, obj.modelMapping));
        break;
      default:
        app.get(path, basicRequestHandler.bind(null, obj.routeHandler, obj.modelMapping));
        break;
    }
  }
}

/**
 * It fetches contract keys and their types
 * @param target The controller class
 * @param propertyKey Handler function name of the controller
 * @param method Handler function of the controller
 * @param options api options
 */
function getModelMapFromTarget(target:Function, propertyKey:string, method:Function, options?: {
  required?: string[],
  validate?: string[],
}): any {
  const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
  const paramNames = getParamNames(method);
  return paramNames.map((val, index) => {
    return {
      paramName: val,
      modelSchema: paramTypes[index],
      isRequired: options.required && options.required.includes(val), // tslint:disable-line
      shouldValidate: options.validate && options.validate.includes(val), // tslint:disable-line
    };
  });
}

/**
 * Push the routes one after another when a decorator runs
 * @param path api path
 * @param routeHandler controller method
 * @param controller controller class
 * @param method http verb
 * @param modelMapping model mapping to parse data while http calls
 */
function recordRoute(
  path: string, 
  routeHandler: () => any, 
  controller: IControllers.IBase, 
  method: string,
  modelMapping: object[],
) {
  ROUTE_METHOD_PATH_MAPPING.push({
    method,
    routeHandler,
    controller,
    path,
    modelMapping,
  });
}

/**
 * To get decorator response
 * @param method http verb
 * @param decorator decorator name
 * @param _path api path
 * @param options api options
 */
function httpDecoratorResponse(method: string, decorator: string, _path?: string, options: {
  required?: string[],
  validate?: string[],
}= {
  required:[],
  validate: [],
}) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let modelMapping = null;
    try {
      modelMapping = getModelMapFromTarget(target, propertyKey, descriptor.value, options);  
    } catch (e) {
      console.log(`Error in parsing ${decorator}() method ${propertyKey} in ${target.name}`);
      throw e;
    }
    const path = _path || `/${propertyKey}`;
    recordRoute(path, descriptor.value, target, method, modelMapping);
  };
}

/**
 * Fetching param names with regX
 * Probably not a great idea, but couldn't find a better one
 */
const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func:Function) {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null)
    result = [];
  return result;
}

/**
 * This function is used from bootstrap to scaffold routes
 * @param appInstance Application instance
 */
export function setupApp(appInstance: express.Application) {
  app = appInstance;
  setupRoutes();
}

/**
 * Using this decorator you can mark a controller as a router
 * @param path router path
 */
export function route(path: string): any {
  return (target: any) => {
    ROUTE_PATH_MAPPING.set(target, path);
  };
}

export function httpGet(
  _path ?: string, 
  options?: {
    required?: string[],
    validate?: string[],
  }): any {
  return httpDecoratorResponse('get', 'httpGet', _path, options);
}
export function httpPost(
  _path ?: string, 
  options?: {
    required?: string[],
    validate?: string[],
  }): any {
  return httpDecoratorResponse('post', 'httpPost', _path, options);
}
export function httpPut(
  _path ?: string, 
  options?: {
    required?: string[],
    validate?: string[],
  }): any {
  return httpDecoratorResponse('put', 'httpPut', _path, options);
}
export function httpDelete(
  _path ?: string, 
  options?: {
    required?: string[],
    validate?: string[],
  }): any {
  return httpDecoratorResponse('delete', 'httpDelete', _path, options);
}
