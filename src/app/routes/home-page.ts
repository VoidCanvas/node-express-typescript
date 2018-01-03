import * as Controllers from '../controllers';
import {
  Base,
} from './index';


export class HomePage extends Base {
  controller: Controllers.HomePage;
  constructor(path:string) {
    super(path, new Controllers.HomePage());
    this.METHOD_MAPPING = [
      {
        path: '/',
        controllerMethod: this.controller.simpleHome,
      },
    ];
  }

}
