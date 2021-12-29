import chalk from "chalk";
import redis from "redis";

const RedisClient = redis.createClient({
	port: 6379,
	host: "127.0.0.1",
});

RedisClient.on("connect", () => {
	console.log(chalk.bgGray(" Client connected to redis "));
});

RedisClient.on("ready", () => {
	console.log(chalk.bgGreen.yellowBright(" Client ready to use "));
});

RedisClient.on("error", (err) => {
	console.log(err.message);
});

RedisClient.on("end", () => {
	console.log(chalk.green(" Client disconnected from redis "));
});

RedisClient.on("error", (err) => {
	console.log(chalk.red(err.message));
});

process.on("SIGINT", () => {
	RedisClient.quit();
});

export default RedisClient;
