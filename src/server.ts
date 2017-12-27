import application from './application';
import environment from './environment';
const envConfig = environment(process.env.environment);

const port = process.env.PORT || envConfig.APP.port || 1729;
const server = application.listen(port, () => {
  console.log(('  Listening to http://localhost:%d'), port);
});
export default server;
