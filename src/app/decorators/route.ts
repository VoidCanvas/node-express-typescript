import * as express from 'express';
import { Response, Base, Status } from '../models';
import * as IControllers from '../interfaces/controllers';
import 'reflect-metadata';
import { stat } from 'fs';

let app:express.Application = null;
const ROUTE_METHOD_PATH_MAPPING:any = [];
const ROUTE_PATH_MAPPING = new Map(); 
const BASE_ROUTE = '/api';

function basicRequestHandler(routeHandler:any, modelMaping: any[], req:express.Request, res:express.Response): void {
  try {
    const argsArr = modelMaping.map((mmap) => {
      const obj = req.body[mmap.paramName] || req.query[mmap.paramName] || req.params[mmap.paramName];
      if (!obj) {
        if (mmap.isRequired === true) {
          throw new Error(`${mmap.paramName} is required`);
        }
        return undefined;
      }
      return new mmap.modelSchema(obj);
    });
    routeHandler(...argsArr)
    .then((response: Response) => {
      res.json(response);
    });
  } catch (e) {
    const status = new Status(false);
    status.error = e;
    const response = new Response(status);
  }
}

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
function getModelMapFromTarget(target:Function, propertyKey:string, method:Function): any {
  const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
  const paramNames = getParamNames(method);
  return paramNames.map((val, index) => {
    return {
      paramName: val,
      modelSchema: paramTypes[index],
      isRequired: false, // TODO: find a way to control this
    };
  });

}
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

const STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func:Function) {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null)
    result = [];
  return result;
}
export function setupApp(appInstance: express.Application) {
  app = appInstance;
  setupRoutes();
}

export function route(path: string): any {
  return (target: any) => {
    ROUTE_PATH_MAPPING.set(target, path);
  };
}

export function httpGet(_path ?: string): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let modelMapping = null;
    try {
      modelMapping = getModelMapFromTarget(target, propertyKey, descriptor.value);  
    } catch (e) {
      console.log(`Error in parsing httpGet() method ${propertyKey} in ${target.name}`);
      throw e;
    }
    const path = _path || `/${propertyKey}`;
    recordRoute(path, descriptor.value, target, 'get', modelMapping);
  };
}
export function httpPost(_path ?: string): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let modelMapping = null;
    try {
      modelMapping = getModelMapFromTarget(target, propertyKey, descriptor.value);  
    } catch (e) {
      console.log(`Error in parsing httpPost() method ${propertyKey} in ${target.name}`);
      throw e;
    }
    let path = _path || `/${propertyKey}`;
    path = path === '/' ? '' : path;
    recordRoute(path, descriptor.value, target, 'post', modelMapping);
  };
}


