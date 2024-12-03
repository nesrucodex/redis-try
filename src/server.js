import express from "express";
import { AppConfig } from "./config/env.js";
import { redisClient } from "./lib/redis.js";
import { redisRoute } from "./routes/redis.routes.js";

const app = express();

// middlewares
app.use(express.json());

// Routes
app.use("/redis", redisRoute);

function main() {
  redisClient
    .connect()
    .then(() => {
      app.listen(AppConfig.PORT, () => {
        console.log(`Server is running on port ${AppConfig.PORT}`);
      });
    })
    .catch(() => {
      process.exit(1);
    });
}

// Start the server
main();
