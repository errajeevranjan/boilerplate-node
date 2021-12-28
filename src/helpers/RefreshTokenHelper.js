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
		JWT.sign(payload, secret, options, (error, token) => {
			if (error) {
				reject(
					createError.InternalServerError(
						"Failed to sign refresh-token, please try again"
					)
				);
			}

			redisClient.SET(id, token, "EX", 30, (error, reply) => {
				if (error) {
					reject(
						createError.InternalServerError(
							"Failed to SET refresh-token in redis"
						)
					);
					return;
				}
				resolve(token);
			});
		});
	});
};

const verifyRefreshTokenOfUser = (refresh_token) => {
	return new Promise((resolve, reject) => {
		JWT.verify(
			refresh_token,
			process.env.REFRESH_TOKEN_SECRET,
			(error, payload) => {
				if (error) {
					return reject(createError.Unauthorized());
				}

				const userId = payload.aud;
				redisClient.GET(userId, (error, result) => {
					if (error) {
						console.log(error.message);
						reject(createError.InternalServerError());
						return;
					}
					if (refresh_token === result) return resolve(userId);
					reject(createError.Unauthorized());
				});
			}
		);
	});
};

export { signRefreshTokenOfUser, verifyRefreshTokenOfUser };
