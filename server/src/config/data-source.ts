import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from "./config";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { Session } from "../models/Session";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: Config.DB_HOST,
  port: Config.DB_PORT,
  username: Config.DB_USER,
  password: Config.DB_PASS,
  database: Config.DB_NAME,

  synchronize: false,
  logging: false,

  entities: [User, Session],

  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
