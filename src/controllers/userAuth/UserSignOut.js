import createError from "http-errors";
import RedisClient from "../../helpers/db/RedisClient.js";
import print_error from "../../helpers/print_error.js";
import VerifyRefreshToken from "./../../helpers/tokens/VerifyRefreshToken.js";
import ExtractRefreshToken from "../../helpers/ExtractRefreshToken.js";

const UserSignOut = async (request, response, next) => {
	try {
		// ? extracting refresh_token from cookie
		const refresh_token = ExtractRefreshToken(request.headers.cookie);

		// ? if no refresh_token then throw error which will be caught by error handler
		if (!refresh_token) throw createError.BadRequest();

		// ? if refresh_token is valid then get id from refresh_token
		const id = await VerifyRefreshToken(refresh_token);

		// ? using id returned by VerifyRefreshToken find the refresh_token in redis and delete it
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
