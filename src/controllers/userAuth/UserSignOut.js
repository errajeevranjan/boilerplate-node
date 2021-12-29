import chalk from "chalk";
import createError from "http-errors";
import VerifyRefreshToken from "./../../helpers/tokens/VerifyRefreshToken.js";

const UserSignOut = async (request, response, next) => {
	try {
		// ? destructuring refresh_token from request body
		const { refresh_token } = request.body;
		// ? if no refresh_token then throw error which will be caught by error handler
		if (!refresh_token) throw createError.BadRequest();
		// ? if refresh_token is valid then VerifyRefreshToken will return id
		const id = await VerifyRefreshToken(refresh_token);
		// ? use id to find and delete user's refresh_token from redis
		client.DEL(id, (err, val) => {
			if (err) {
				console.log(chalk.red(err.message));
				throw createError.InternalServerError();
			}
			console.log(chalk.bgGray(val));
			response.sendStatus(204);
		});
	} catch (error) {
		next(error);
	}
};

export default UserSignOut;
