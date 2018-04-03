import { Application } from 'express';
import * as modelToDb from './model-to-db';
import { setupApp } from './decorators/route';
import './controllers'; // importing so that the decorators can be called

export default async function (app:Application) {
  modelToDb.setupEntities() // will handle model related scaffolding
  .then(() => {
    setupApp(app); // will setup routes
  }).catch((e:any) => {
    console.log(e);
  });
}
