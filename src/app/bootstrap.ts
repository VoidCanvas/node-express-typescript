const BASE_ROUTE = '/api';

import {
  HomePage,
} from './routes';

const ACTIVE_ROUTES: {routerClass: any, path: string }[] = [
  {
    path: '/',
    routerClass: HomePage,
  },
];

export default function (app:Express.Application) {

  // Activating routes
  ACTIVE_ROUTES.forEach((router) => {
    const route = new router.routerClass(`${BASE_ROUTE}${router.path}`);
    route.mapRouteWithControllerMethods(app);
  });
}
