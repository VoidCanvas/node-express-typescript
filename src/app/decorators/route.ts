import * as express from 'express';
import { Response } from '../models';
import * as IControllers from '../interfaces/controllers';

let app:express.Application = null;
const ROUTE_METHOD_PATH_MAPPING:any = [];
const ROUTE_PATH_MAPPING = new Map(); 
const BASE_ROUTE = '/api';

function basicRequestHandler(routeHandler:any, req:express.Request, res:express.Response): void {
  routeHandler()
  .then((response: Response) => {
    res.json(response);
  });
}

function setupRoutes() {
  while (ROUTE_METHOD_PATH_MAPPING.length > 0) {
    const obj = ROUTE_METHOD_PATH_MAPPING.shift();
    const routeControllerConstructor = obj.controller && obj.controller.constructor;
    let path = (ROUTE_PATH_MAPPING.get(routeControllerConstructor)) ? ROUTE_PATH_MAPPING.get(routeControllerConstructor) : '';
    path = `${BASE_ROUTE}${path}${obj.path}`;
    switch (obj.method){
      case 'post':
        app.post(path, basicRequestHandler.bind(null, obj.routeHandler));
        break;
      case 'put':
        app.put(path, basicRequestHandler.bind(null, obj.routeHandler));
        break;
      case 'delete':
        app.delete(path, basicRequestHandler.bind(null, obj.routeHandler));
        break;
      case 'patch':
        app.patch(path, basicRequestHandler.bind(null, obj.routeHandler));
        break;
      default:
        app.get(path, basicRequestHandler.bind(null, obj.routeHandler));
        break;
    }
  }
}
function recordRoute(
  path: string, 
  routeHandler: () => any, 
  controller: IControllers.IBase, 
  method: string,
) {
  ROUTE_METHOD_PATH_MAPPING.push({
    method,
    routeHandler,
    controller,
    path,
  });
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
    const path = _path || `/${propertyKey}`;
    recordRoute(path, descriptor.value, target, 'get');
  };
}
export function httpPost(_path ?: string): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const path = _path || `/${propertyKey}`;
    recordRoute(path, descriptor.value, target, 'post');
  };
}


