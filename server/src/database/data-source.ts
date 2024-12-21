import { DataSource, DataSourceOptions } from 'typeorm';

const isCompiled = __dirname.includes('dist');

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'manga_shop',
  entities: isCompiled
    ? ['dist/**/*.entity{.ts,.js}']
    : ['src/**/*.entity{.ts,.js}'],
  migrations: isCompiled
    ? ['dist/src/database/migrations/*{.ts,.js}']
    : ['src/database/migrations/*{.ts,.js}'],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
