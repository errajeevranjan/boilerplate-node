import chalk from "chalk";
import createError from "http-errors";
import { signAccessTokenOfUser } from "../../helpers/AccessTokenHelper.js";
import {
	signRefreshTokenOfUser,
	verifyRefreshTokenOfUser,
} from "../../helpers/RefreshTokenHelper.js";

const UserRefreshToken = async (request, response, next) => {
	try {
		// ? destructuring refresh_token from request body
		const { refresh_token } = request.body;

		// ? if no refresh_token then throw error which will be caught by error handler
		if (!refresh_token) throw createError.BadRequest();
		// ? storing id that will be returned by verifyRefreshTokenOfUser upon successful verification so that we can user this id to signAccessTokenOfUser
		const id = await verifyRefreshTokenOfUser(refresh_token);

		//? creating new sets of access_token and refresh_token
		const new_access_token = await signAccessTokenOfUser(id);
		const new_refresh_token = await signRefreshTokenOfUser(id);
		// ? sending new access_token and refresh_token to the client
		response.send({
			token: {
				access_token: new_access_token,
				refresh_token: new_refresh_token,
			},
		});
	} catch (error) {
		console.log(chalk.red("error", error));
		next(error);
	}
};

export default UserRefreshToken;
