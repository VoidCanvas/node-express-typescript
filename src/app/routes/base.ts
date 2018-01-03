import { Application } from 'express';
import { 
  IBase,
} from '../interfaces/routes';
import * as Controllers from '../controllers';
 
export class Base implements IBase{
  path: string;
  controller: Controllers.Base;
  METHOD_MAPPING: {path: string, controllerMethod:any}[];
  mapRouteWithControllerMethods(
      app:Application,
    ): void {
    this.METHOD_MAPPING.forEach((map) => {
      app.get(`${map.path}/`, map.controllerMethod);

    });
  }

  constructor(path:string, controller: Controllers.Base) {
    this.path = path;
    this.controller = controller;
  }
}
