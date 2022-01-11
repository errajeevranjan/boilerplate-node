import chalk from "chalk";
import dotenv from "dotenv";
import express from "express";
import createError from "http-errors";
import morgan from "morgan";
import InitializeMongoDb from "./helpers/db/InitializeMongoDb.js";
import UserAuthRoutes from "./routes/user/UserAuthRoutes.js";
import UserProfileRoutes from "./routes/user/UserProfileRoutes.js";

dotenv.config(); // Load .env file

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
InitializeMongoDb(); // Initialize MongoDB

// ? handling all the routes
app.get("/user", async (request, response, next) => {
	response.send("Welcome to the backend of boilerplate node-js.");
});
app.get("/favicon.ico", (request, response) => response.sendStatus(204));

/* //* USER ROUTES BELOW */
app.use("/user/auth", UserAuthRoutes);
app.use("/user/profile", UserProfileRoutes);

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
