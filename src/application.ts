import * as express from 'express';
import * as bodyParser from 'body-parser';
import bootstrap from './app/bootstrap';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// bootstrap it
bootstrap(app);

export default app;
