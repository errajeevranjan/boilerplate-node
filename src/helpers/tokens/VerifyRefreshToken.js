import chalk from "chalk";
import createError from "http-errors";
import JWT from "jsonwebtoken";
import RedisClient from "../db/RedisClient.js";
import print_error from "../print_error.js";

// ? verifying refresh token
const VerifyRefreshToken = (refresh_token) =>
	new Promise((resolve, reject) => {
		JWT.verify(
			refresh_token,
			process.env.REFRESH_TOKEN_SECRET,
			(errorVerifyingRefreshToken, payload) => {
				if (errorVerifyingRefreshToken) {
					print_error("16:: VerifyRefreshToken.js", errorVerifyingRefreshToken);
					reject(createError.Unauthorized());
				}
				// ? storing id to return it back for the purpose of signing new access and refresh tokens
				const id = payload.aud;

				// ? blacklisting the refresh token
				RedisClient.GET(id, (errorGettingRefreshToken, result) => {
					if (errorGettingRefreshToken) {
						console.log(chalk.red(errorGettingRefreshToken.message)); // ? we dont want this message to be sent to user so we can console.log it instead
						reject(createError.InternalServerError());
					}
					if (refresh_token === result) resolve(id);
					reject(createError.Unauthorized());
				});
			}
		);
	});

export default VerifyRefreshToken;
