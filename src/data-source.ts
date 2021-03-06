import "reflect-metadata"
import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "task-management",
  entities: [
    __dirname + '/../**/*.entity{.ts,.js}',
  ],
  synchronize: true
})
