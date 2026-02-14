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

  LLM_API_URL: string;
  LLM_MODEL: string;

  GROQ_API_KEY: string;
  GROQ_MODEL: string;

  GOOGLE_API_KEY: string;
  GOOGLE_MODEL: string;
}

const loadConfig = (): AppConfig => {
  const requiredEnvVars = [
    "PORT",
    "DB_HOST",
    "DB_USER",
    "DB_PASS",
    "DB_NAME",
    "DB_PORT",
    "JWT_SECRET",
    "LLM_API_URL",
    "LLM_MODEL",
    "GROQ_API_KEY",
    "GROQ_MODEL",
    "GOOGLE_API_KEY",
    "GOOGLE_MODEL",
  ];
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

    LLM_API_URL: process.env.LLM_API_URL!,
    LLM_MODEL: process.env.LLM_MODEL!,

    GROQ_API_KEY: process.env.GROQ_API_KEY!,
    GROQ_MODEL: process.env.GROQ_MODEL!,

    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY!,
    GOOGLE_MODEL: process.env.GOOGLE_MODEL!,
  };
};

export const Config = loadConfig();
