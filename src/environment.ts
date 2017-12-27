export default function (environment:string) {
  const ENV = {
    environment,
    APP: {
      port: 1729,    
    },
    isLoggingEnabled : false,
  };

  if (environment === 'development') {
    ENV.isLoggingEnabled = true;
  }
  if (environment === 'production') {
    ENV.APP.port = 1730;
  }

  // add other environments as well

  return ENV;
}
