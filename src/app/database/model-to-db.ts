/**
 * This handles db scaffold, migration, synchronization etc.
 * Currently using typeorm as orm module.
 */

import 'reflect-metadata';
import { createConnection } from 'typeorm';
import ENV from '../../environment';
import { Employee } from '../models/';
import config from './config';

const entities = [
  Employee,
];
export function setupEntities() {
  return createConnection({
    entities,
    type: 'postgres', // using postgres now 
    ...config,
    synchronize:  ENV.isDev ? true : false,
    logging: false,
  });
}
