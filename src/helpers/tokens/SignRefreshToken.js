import createError from "http-errors";
import JWT from "jsonwebtoken";
import RedisClient from "../db/RedisClient.js";
import print_error from "../print_error.js";

//? function for signing refresh token using user's DB id

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
				print_error("26 :: SignRefreshToken.js", errorSigningRefreshToken);

				reject(createError.InternalServerError());
			}

			RedisClient.SET(
				id,
				token,
				"EX",
				31536000, // ? 1 year in seconds
				(errorSettingRefreshToken, reply) => {
					if (errorSettingRefreshToken) {
						print_error("41 :: SignRefreshToken.js", errorSettingRefreshToken);

						reject(createError.InternalServerError());
					}
					resolve(token);
				}
			);
		});
	});

export default SignRefreshToken;
