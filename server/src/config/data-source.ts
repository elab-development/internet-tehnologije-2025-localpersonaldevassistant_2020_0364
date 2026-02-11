import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from "./config";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { Session } from "../models/Session";
import { Feedback } from "../models/Feedback";
import { BlacklistedToken } from "../models/BlacklistedToken";
import { Snippet } from "../models/Snippet";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: Config.DB_HOST,
  port: Config.DB_PORT,
  username: Config.DB_USER,
  password: Config.DB_PASS,
  database: Config.DB_NAME,

  synchronize: false,
  logging: true,

  entities: [User, Session, Message, Feedback, BlacklistedToken, Snippet],

  migrations: [process.env.NODE_ENV === "production" ? "dist/migrations/*.js" : "src/migrations/*.ts"],
  subscribers: [],
});
