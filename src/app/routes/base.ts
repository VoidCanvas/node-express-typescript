import { 
  IBase,
} from '../interfaces/routes';
import * as Controllers from '../controllers';
 
export class Base implements IBase{
  controller: Controllers.Base;
  mapRouteWithControllerMethods(
      app:Express.Application,
    ): void {
      
  }
  path: string;

  constructor(path:string, controller: Controllers.Base) {
    this.path = path;
    this.controller = controller;
  }
}
