import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'mysql://shopora:shopora_password@mysql:3306/shopora';

// For serverless / lambda / Next.js API environment, we use a single connection pool
const poolConnection = mysql.createPool({
  uri: connectionString,
  connectionLimit: 10,
});

export const db = drizzle(poolConnection, { schema, mode: 'default' });
