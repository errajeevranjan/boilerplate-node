import createError from "http-errors";
import RedisClient from "../../helpers/db/RedisClient.js";
import print_error from "../../helpers/print_error.js";
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

		RedisClient.DEL(id, (error, value) => {
			if (error) {
				print_error("24 :: UserSignOut.js", error.message);
				throw createError.InternalServerError();
			}
			response.sendStatus(204);
		});
	} catch (error) {
		print_error("24 :: UserSignOut.js", error);
		next(error);
	}
};

export default UserSignOut;
