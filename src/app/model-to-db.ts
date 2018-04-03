/**
 * This handles db scaffold, migration, synchronization etc.
 * Currently using typeorm as orm module.
 */

import 'reflect-metadata';
import { createConnection } from 'typeorm';
import ENV from '../environment';
import { Employee } from './models/';

const entities = [
  Employee,
];
export function setupEntities() {
  return createConnection({
    entities,
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgre',
    database: 'voidcanvas',
    synchronize:  ENV.isDev ? true : false,
    logging: false,
  });
}
