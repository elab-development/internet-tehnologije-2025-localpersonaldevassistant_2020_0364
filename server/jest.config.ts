import type { Config } from "@jest/types";
 
const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  roots: ["<rootDir>/src"],
  setupFiles: ["<rootDir>/src/tests/setup.ts"],
};

export default config;
