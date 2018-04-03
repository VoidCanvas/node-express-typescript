// ENV class 
class Environment{
  APP: any;
  environment: string;
  isDev: boolean;
  isTest: boolean;
  isProd: boolean;
  isLoggingEnabled: boolean;
}

// default env object
const ENV:Environment = {
  APP: {
    port: 1729,    
  },
  environment: 'development',
  isLoggingEnabled : false,
  isDev: false,
  isTest: false,
  isProd: false,
};

export default ENV;
export function init(environment?:string) {
  if (environment) {
    ENV.environment = environment;
  }    
  if (ENV.environment === 'development') {
    ENV.isLoggingEnabled = true;
    ENV.isDev = true;
  }
  if (ENV.environment === 'test') {
    ENV.isLoggingEnabled = true;
    ENV.isTest = true;
  }
  if (ENV.environment === 'production') {
    ENV.APP.port = 1730;
    ENV.isProd = true;    
  }

  // add other environments as well
  Object.seal(ENV);
  return ENV;
}
