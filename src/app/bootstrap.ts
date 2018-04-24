import * as express from 'express';
import * as modelToDb from './database/model-to-db';
import { setupApp } from './decorators/route';
import { initAuth } from './authenticate/init';
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

import './controllers'; // importing so that the decorators can be called
import config from '../config';

export default async function (app:express.Application) {
  app.use(session({
    store: new RedisStore({
      url: `//${config.cache.host}:${config.cache.port}`,
    }),
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
  }));
  initAuth(app);
  modelToDb.setupEntities() // will handle model related scaffolding
  .then(() => {
    setupApp(app); // will setup routes
    app.use('*', express.static(__dirname + '/../public'));
  }).catch((e:any) => {
    console.log(e);
  });
}
