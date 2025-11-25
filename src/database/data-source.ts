import { config } from 'dotenv';

import { DataSource } from 'typeorm';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: parseInt(process.env.POSTGRES_PORT!) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});

export default AppDataSource;
