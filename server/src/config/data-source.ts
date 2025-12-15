import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from "./config";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: Config.DB_HOST,
  port: Config.DB_PORT,
  username: Config.DB_USER,
  password: Config.DB_PASS,
  database: Config.DB_NAME,

  synchronize: true,

  logging: false,

  migrations: [],
  subscribers: [],
});
