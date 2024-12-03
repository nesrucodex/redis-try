import dontenv from "dotenv";
dontenv.config();

export const AppConfig = {
  PORT: process.env.PORT || 5050,
  REDIS_PORT: parseInt(process.env.REDIS_PORT) || 6379,
};
