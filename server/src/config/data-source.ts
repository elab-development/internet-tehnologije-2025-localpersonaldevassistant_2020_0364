import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from "./config";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { Session } from "../models/Session";
import { Workspace } from "../models/Workspace";
import { Feedback } from "../models/Feedback";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: Config.DB_HOST,
  port: Config.DB_PORT,
  username: Config.DB_USER,
  password: Config.DB_PASS,
  database: Config.DB_NAME,

  synchronize: false,
  logging: false,

  entities: [User, Session, Message, Workspace, Feedback],

  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
