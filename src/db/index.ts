import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const isDatabaseConfigured = (): boolean => {
  return Boolean(process.env.SQL_HOST && process.env.SQL_USER && process.env.SQL_DB_NAME);
};

export const createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST || '127.0.0.1',
      user: process.env.SQL_USER || 'postgres',
      password: process.env.SQL_PASSWORD || '',
      database: process.env.SQL_DB_NAME || 'careerpath',
      max: 10,
      connectionTimeoutMillis: 3000,
    });

    global._postgresPool.on('error', (err) => {
      console.warn('Unexpected error on idle SQL pool client:', err.message);
    });
  }
  return global._postgresPool;
};

let db: any;
try {
  const pool = createPool();
  db = drizzle(pool, { schema });
} catch {
  console.warn('[AI Studio] Database not connected — using mock');
  const noOp = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {},
    delete: async () => ({}),
  };
  db = new Proxy({}, {
    get: (_, prop) =>
      prop === 'query'
        ? new Proxy({}, { get: () => noOp })
        : () => ({
            from: () => ({
              where: () => ({ limit: async () => [], returning: async () => [] }),
              limit: async () => [],
            }),
            values: () => ({ returning: async () => [] }),
            set: () => ({ where: () => ({ returning: async () => [] }) }),
          }),
  });
}

export { db };

