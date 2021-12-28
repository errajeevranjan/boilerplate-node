import chalk from "chalk";
import redis from "redis";

const redisClient = redis.createClient({
	port: 6379,
	host: "127.0.0.1",
});

redisClient.on("connect", () => {
	console.log(chalk.bgGray(" Client connected to redis "));
});

redisClient.on("ready", () => {
	console.log(chalk.bgGreen.yellowBright(" Client ready to use "));
});

redisClient.on("error", (err) => {
	console.log(err.message);
});

redisClient.on("end", () => {
	console.log(chalk.green(" Client disconnected from redis "));
});

redisClient.on("error", (err) => {
	console.log(chalk.red(err.message));
});

process.on("SIGINT", () => {
	redisClient.quit();
});

export default redisClient;
