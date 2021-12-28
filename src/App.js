import chalk from "chalk";
import dotenv from "dotenv";
import express from "express";
import createError from "http-errors";
import morgan from "morgan";
import { verifyAccessTokenOfUser } from "./helpers/AccessTokenHelper.js";
import InitializeMongoDb from "./helpers/MongoDbHelper.js";
import AuthRoutes from "./routes/AuthRoutes.js";
dotenv.config(); // Load .env file

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
InitializeMongoDb(); // Initialize MongoDB
// ? handling all the routes
app.get("/", verifyAccessTokenOfUser, async (request, response, next) => {
	response.send("Hello authenticated user.");
});
app.get("/favicon.ico", (request, response) => response.status(204));

app.use("/auth", AuthRoutes);

// ? handling errors
app.use(async (request, response, next) => {
	next(createError.NotFound("This route does not exist"));
});

app.use((error, request, response, next) => {
	response.status(error.status || 500);
	response.send({
		error: {
			status: error.status || 500,
			message: error.message,
		},
	});
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(chalk.bgBlue.whiteBright(` Server running on port ${PORT} `));
});
