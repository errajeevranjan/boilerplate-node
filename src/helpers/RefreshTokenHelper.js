import chalk from "chalk";
import createError from "http-errors";
import JWT from "jsonwebtoken";
import redisClient from "./RedisHelper.js";

const signRefreshTokenOfUser = ({ id }) => {
	return new Promise((resolve, reject) => {
		const payload = {
			id,
		};
		const secret = process.env.REFRESH_TOKEN_SECRET;
		const options = {
			expiresIn: "24h",
			issuer: "bhaktipath.in",
			audience: id,
		};
		JWT.sign(
			payload,
			secret,
			options,
			(errorWhileSigningRefreshToken, token) => {
				if (errorWhileSigningRefreshToken) {
					console.log(
						chalk.red("Failed to sign refresh-token, please try again")
					);
					reject(createError.InternalServerError());
				}

				redisClient.SET(
					id,
					token,
					"EX",
					30,
					(errorWhileSettingRefreshToken, reply) => {
						if (errorWhileSettingRefreshToken) {
							console.log(chalk.red("Failed to SET refresh-token in redis"));
							reject(createError.InternalServerError());
							return;
						}
						resolve(token);
					}
				);
			}
		);
	});
};

const verifyRefreshTokenOfUser = (refresh_token) => {
	return new Promise((resolve, reject) => {
		JWT.verify(
			refresh_token,
			process.env.REFRESH_TOKEN_SECRET,
			(errorWhileVerifyingRefreshToken, payload) => {
				if (errorWhileVerifyingRefreshToken) {
					return reject(createError.Unauthorized());
				}

				const id = payload.aud;
				redisClient.GET(id, (errorWhileGettingRefreshToken, result) => {
					if (errorWhileGettingRefreshToken) {
						console.log(chalk.red(errorWhileGettingRefreshToken.message)); // ? we dont want this message to be sent to user so we can console.log it instead
						reject(createError.InternalServerError());
						return;
					}
					if (refresh_token === result) return resolve(id);
					reject(createError.Unauthorized());
				});
			}
		);
	});
};

export { signRefreshTokenOfUser, verifyRefreshTokenOfUser };
