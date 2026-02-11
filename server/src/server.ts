import { Config } from "./config/config";
import "reflect-metadata";
import app from "./app";
import { AppDataSource } from "./config/data-source";

const green = "\x1b[32m";
const cyan = "\x1b[36m";
const reset = "\x1b[0m";
const dim = "\x1b[2m";

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    app.listen(Config.PORT, "0.0.0.0", () => {
      console.log(`
        ${green}●${reset} ${cyan}Server started${reset}
        ${dim}--------------------------------------------------${reset}
          ${green}»${reset} URL:    ${cyan}http://0.0.0.0:${Config.PORT}${reset}
          ${green}»${reset} Health: ${cyan}http://0.0.0.0:${Config.PORT}/api/health${reset}
        ${dim}--------------------------------------------------${reset}
      `);
    });
  } catch (error) {
    console.error("Error during server startup: ", error);
    process.exit(1);
  }
};

startServer();
