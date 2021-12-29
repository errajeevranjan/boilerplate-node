import chalk from "chalk";
import createError from "http-errors";
import JWT from "jsonwebtoken";
import redisClient from "./RedisHelper.js";

const signRefreshTokenOfUser = (id) => {
	return new Promise((resolve, reject) => {
		// ? creating payload
		const payload = { id };
		// ? creating secret
		const secret = process.env.REFRESH_TOKEN_SECRET;
		// ? setting options
		const options = {
			expiresIn: "1y",
			issuer: "bhaktipath.in",
			audience: id,
		};

		// ? signing token
		JWT.sign(payload, secret, options, (errorSigningRefreshToken, token) => {
			if (errorSigningRefreshToken) {
				console.log(
					chalk.red(
						"Failed to sign refresh-token, please try again",
						errorSigningRefreshToken
					)
				);
				reject(createError.InternalServerError());
			}

			redisClient.SET(
				id,
				token,
				"EX",
				31536000, // ? 1 year in seconds
				(errorSettingRefreshToken, reply) => {
					if (errorSettingRefreshToken) {
						console.log(
							chalk.red(
								"Failed to SET refresh-token in redis",
								errorSettingRefreshToken
							)
						);
						reject(createError.InternalServerError());
					}
					resolve(token);
				}
			);
		});
	});
};
// ? verifying refresh token
const verifyRefreshTokenOfUser = (refresh_token) => {
	return new Promise((resolve, reject) => {
		JWT.verify(
			refresh_token,
			process.env.REFRESH_TOKEN_SECRET,
			(errorVerifyingRefreshToken, payload) => {
				if (errorVerifyingRefreshToken) {
					console.log(
						chalk.red(
							"Failed to verify refresh-token",
							errorVerifyingRefreshToken
						)
					);
					reject(createError.Unauthorized());
				}
				// ? storing id to return it back for the purpose of signing new access and refresh tokens
				const id = payload.aud;

				// ? blacklisting the refresh token
				redisClient.GET(id, (errorGettingRefreshToken, result) => {
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
};

export { signRefreshTokenOfUser, verifyRefreshTokenOfUser };
