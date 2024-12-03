import express from "express";
import { redisClient } from "../lib/redis.js";
const redisRoute = express.Router();

redisRoute.get("/", async (req, res) => {
  try {
    const keys = await redisClient.keys("*");
    if (keys.length === 0)
      return res.json({ success: true, message: "No keys found in Redis" });

    const values = await redisClient.mGet(keys);

    const redisObj = keys.map((key, index) => ({
      key,
      value: values[index],
    }));

    res.json({ message: "Get operation successful", data: redisObj });
  } catch (error) {
    res.status(500).json({
      message: "Error getting value from Redis",
      error,
      success: false,
    });
  }
});

redisRoute.get("/:key", async (req, res) => {
  const key = req.params.key;
  if (!key || !key.trim())
    return res.status(404).json({
      success: false,
      message: "Key is required",
    });
  try {
    const doesKeyExist = await redisClient.EXISTS(key);
    if (doesKeyExist !== 1)
      return res.json({
        success: false,
        message: "Key not found in Redis",
      });

    const keyValue = await redisClient.get(key);

    res.json({
      success: true,
      message: `Value for "${key}" key.`,
      data: keyValue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting key from Redis",
      error,
    });
  }
});

redisRoute.post("/", async (req, res) => {
  try {
    const { key, value } = req.body;
    await redisClient.set(key, value);
    res.json({
      success: true,
      message: "Set operation successful",
      key,
      value,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error setting value in Redis",
      error,
    });
  }
});

redisRoute.delete("/:key", async (req, res) => {
  const key = req.params.key;
  if (!key || !key.trim())
    return res.status(404).json({
      success: false,
      message: "Key is required",
    });
  try {
    const doesKeyExist = await redisClient.EXISTS(key);
    if (doesKeyExist !== 1)
      return res.json({
        success: false,
        message: "Key not found in Redis",
      });

    const deletedKeysCount = await redisClient.DEL(key);

    res.json({
      success: true,
      message: `Deleted ${deletedKeysCount} key(s) from Redis`,
      data: deletedKeysCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting key from Redis",
      error,
    });
  }
});

export { redisRoute };
