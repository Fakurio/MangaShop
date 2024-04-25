import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: 'root',
  password: '2137',
  database: 'manga_shop',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
