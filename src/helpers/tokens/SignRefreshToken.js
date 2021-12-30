import chalk from "chalk";
import createError from "http-errors";
import JWT from "jsonwebtoken";
import RedisClient from "../db/RedisClient.js";

const SignRefreshToken = (id) =>
	new Promise((resolve, reject) => {
		// ? creating payload
		const payload = { id };
		// ? creating secret
		const secret = process.env.REFRESH_TOKEN_SECRET;
		// ? setting options
		const options = {
			expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
			issuer: process.env.TOKEN_ISSUER,
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

			RedisClient.SET(
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

export default SignRefreshToken;
