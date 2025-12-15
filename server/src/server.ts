import { Config } from "./config/config";
import "reflect-metadata";
import app from "./app";
import { AppDataSource } from "./config/data-source";

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    app.listen(Config.PORT, () => {
      console.log(`Server started on http://localhost:${Config.PORT}`);
      console.log(`Health check: http://localhost:${Config.PORT}/api/health`);
    });
  } catch (error) {
    console.error("Error during server startup: ", error);
    process.exit(1);
  }
};

startServer();
