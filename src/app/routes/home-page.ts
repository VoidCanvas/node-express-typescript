import {
  Base,
} from './index';
import * as Controllers from '../controllers';

export class HomePage extends Base {
  controller: Controllers.HomePage;
  constructor(path:string) {
    super(path, new Controllers.HomePage());
  }
  mapRouteWithControllerMethods(app: any) {
    app.get(`${this.path}/`, this.controller.simpleHome);
  }
}
