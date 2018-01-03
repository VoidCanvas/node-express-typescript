import { Application } from 'express';

const BASE_ROUTE = '/api';

// import all your necessary routers here
import {
  HomePage,
} from './routes';

// This const hold the router and path mapping. All your new routes should get the path from here
const ACTIVE_ROUTES: {routerClass: any, path: string }[] = [
  {
    path: '/',
    routerClass: HomePage,
  },
];

export default function (app:Application) {

  // Activating routes
  ACTIVE_ROUTES.forEach((router) => {
    const route = new router.routerClass(`${BASE_ROUTE}${router.path}`);
    route.mapRouteWithControllerMethods(app); // the 
  });
}
