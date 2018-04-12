/**
 * database client of this project
 * 
 */
const { Pool, Client } = require('pg');
import config from './config';

function getPool(): any {
  const pool = new Pool({
    ...config,
  });
  return pool;
}

export async function execute(sql:string): Promise<any> {
  const pool = getPool();
  const res = await pool.query(sql);
  await pool.end();
  return res;
}
