import { Application, Request, Response } from 'express';

import * as Routes from '../interfaces/routes';
import * as Models from '../interfaces/models';
import * as Controllers from '../controllers';
 
export class Base implements Routes.IBase{
  path: string;
  controller: Controllers.Base;
  METHOD_MAPPING: {
    path: string, 
    controllerMethod: (req:Request, res:Response) => Promise<Models.IResponse>,
  }[];
  mapRouteWithControllerMethods(
      app:Application,
    ): void {
    this.METHOD_MAPPING.forEach((map) => {
      app.get(`${this.path}${map.path}`, (req, res) => {
        map.controllerMethod(req, res)
        .then((response) => {
          res.json(response);
        });
      });
    });
  }

  constructor(path:string, controller: Controllers.Base) {
    this.path = path;
    this.controller = controller;
  }
}
