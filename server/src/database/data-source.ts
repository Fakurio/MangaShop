import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

const isCompiled = __dirname.includes('dist');
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  ...(process.env.NODE_ENV === 'production'
    ? {
        socketPath: process.env.DB_HOST,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
      }),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: isCompiled
    ? ['dist/**/*.entity{.ts,.js}']
    : ['src/**/*.entity{.ts,.js}'],
  migrations: isCompiled
    ? ['dist/src/database/migrations/*{.ts,.js}']
    : ['src/database/migrations/*{.ts,.js}'],
  ...(process.env.NODE_ENV !== 'production' ? { synchronize: true } : {}),
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
