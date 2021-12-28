import chalk from "chalk";
import mongoose from "mongoose";

const InitializeMongoDb = () => {
	console.log(chalk.bgCyanBright.blackBright(" Loaded InitializeMongoDb.js "));

	mongoose
		.connect(process.env.MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log(chalk.yellow.bgCyan(" MongoDB connected "));
		})
		.catch((err) => console.log(err.message));

	mongoose.connection.on("connected", () => {
		console.log(chalk.cyan.bgYellowBright(" Mongoose connected to db "));
	});

	mongoose.connection.on("error", (err) => {
		console.log(chalk.bgRedBright.bgMagentaBright(err.message));
	});

	mongoose.connection.on("disconnected", () => {
		console.log(" Mongoose connection is disconnected ");
	});

	process.on("SIGINT", async () => {
		await mongoose.connection.close();
		process.exit(0);
	});
};
export default InitializeMongoDb;
