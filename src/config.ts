import ENV from './environment';

const config = {
  secret: 'some-secret',
  database: {
    host: 'localhost',
    port: 5432,
    username: 'root',
    password: 'postgre',
    database: 'voidcanvas',
  },
  cache: {
    host: 'localhost',
    port: 6379,
    username: '',
    password: '',
  },
};

if (ENV.isProd) {
  
}

export default config;
