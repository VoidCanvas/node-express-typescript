import * as Controllers from '../controllers';
import {
  Base,
} from './index';


export class HomePage extends Base {
  controller: Controllers.HomePage;
  constructor(path:string) {
    const controller = new Controllers.HomePage(); // initializing the particular controller
    super(path, controller);
    this.METHOD_MAPPING = [
      {
        path: '/',
        controllerMethod: this.controller.simpleHome,
      },
    ];
  }

}
