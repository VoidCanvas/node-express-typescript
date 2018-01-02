import * as IControllers from '../controllers';
export interface IBase {
  path: string;
  controller: IControllers.IBase;
  mapRouteWithControllerMethods(
      app:Express.Application,
    ):void;
}



