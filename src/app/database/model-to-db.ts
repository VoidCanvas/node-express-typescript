/**
 * This handles db scaffold, migration, synchronization etc.
 * Currently using typeorm as orm module.
 */

import 'reflect-metadata';
import { createConnection } from 'typeorm';
import ENV from '../../environment';
import config from '../../config';
import { 
  Employee,
  User,
} from '../models/';

const entities = [
  Employee,
  User,
];
export function setupEntities() {
  return createConnection({
    entities,
    type: 'postgres', // using postgres now 
    ...config.database,
    synchronize:  ENV.isDev ? true : false,
    logging: false,
  });
}
