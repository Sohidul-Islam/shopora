import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'mysql://root@localhost:3306/shopora';

declare global {
  // eslint-disable-next-line no-var
  var __mysqlPoolConnection: mysql.Pool | undefined;
}

// Preserve connection pool across Next.js HMR reloads in development
const poolConnection =
  globalThis.__mysqlPoolConnection ??
  mysql.createPool({
    uri: connectionString,
    connectionLimit: 10,
    maxIdle: 2,
    idleTimeout: 30000,
    waitForConnections: true,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__mysqlPoolConnection = poolConnection;
}

export const db = drizzle(poolConnection, { schema, mode: 'default' });
