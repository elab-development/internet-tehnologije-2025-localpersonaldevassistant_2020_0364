import * as dotenv from "dotenv";

dotenv.config();

interface AppConfig {
  PORT: number;

  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASS: string;

  JWT_SECRET: string;
}

const loadConfig = (): AppConfig => {
  const requiredEnvVars = ["PORT", "DB_HOST", "DB_USER", "DB_PASS", "DB_NAME", "DB_PORT", "JWT_SECRET"];

  for (const key of requiredEnvVars) {
    if (process.env[key] === undefined || process.env[key] === null) {
      console.error(`FATAL ERROR: Environment variable ${key} is not defined.`);
      process.exit(1);
    }
  }

  return {
    PORT: parseInt(process.env.PORT!, 10),

    DB_NAME: process.env.DB_NAME!,
    DB_HOST: process.env.DB_HOST!,
    DB_PORT: parseInt(process.env.DB_PORT!, 10),
    DB_USER: process.env.DB_USER!,
    DB_PASS: process.env.DB_PASS!,

    JWT_SECRET: process.env.JWT_SECRET!,
  };
};

export const Config = loadConfig();
