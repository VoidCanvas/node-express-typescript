import { Application } from 'express';
import { setupApp } from './decorators/route';
import './controllers'; // importing so that the decorators can be called

export default function (app:Application) {
  setupApp(app);
}
