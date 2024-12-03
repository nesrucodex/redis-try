import { createClient } from "redis";
import { AppConfig } from "../config/env.js";

export const redisClient = createClient({
  port: 6389,
});

redisClient.on("connect", () => {
  console.log("Connected to redis server on port:", AppConfig.REDIS_PORT);
});

redisClient.on("error", (err) => {
  console.error(`Error connecting to Redis: ${err}`);
});
