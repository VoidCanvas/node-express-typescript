import * as environment from './environment';
const envConfig = environment.init(process.env.environment);

import application from './application';

const port = process.env.PORT || envConfig.APP.port || 1729;
const server = application.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
  console.log(`Running in ${envConfig.environment} mode`);
});
export default server;
