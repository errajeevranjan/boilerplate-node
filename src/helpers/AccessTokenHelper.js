import chalk from "chalk";
import createError from "http-errors";
import JWT from "jsonwebtoken";

const signAccessTokenOfUser = (id) => {
	return new Promise((resolve, reject) => {
		// ? creating payload
		const payload = { id };
		// ? creating secret
		const secret = process.env.ACCESS_TOKEN_SECRET;
		// ? setting options
		const options = {
			expiresIn: "60s",
			issuer: "bhaktipath.in",
			audience: id,
		};

		// ? signing token
		JWT.sign(
			payload,
			secret,
			options,
			(errorWhileSigningAccessToken, token) => {
				if (errorWhileSigningAccessToken) {
					console.log(
						chalk.red(
							"Failed to sign access-token, please try again",
							errorWhileSigningAccessToken
						)
					);
					reject(createError.InternalServerError());
				}
				resolve(token);
			}
		);
	});
};

// ? middleware for checking access-token in header
// ! if token exists and is valid user will gain access to protected routes
const verifyAccessTokenOfUser = (request, response, next) => {
	// ? if there is no authorization header in the request throw error
	if (!request.headers.authorization) return next(createError.Unauthorized());
	// ? if there is authorization header in the request then attempt to verify it
	const authHeaders = request.headers.authorization;
	const bearerToken = authHeaders.split(" ");

	const token = bearerToken[1];

	// ? verifying token
	JWT.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET,
		(errorWhileVerifyingToken, payload) => {
			// ? if there is an error in verifying token throw error
			if (errorWhileVerifyingToken) {
				const message =
					errorWhileVerifyingToken.name === "JsonWebTokenError"
						? "Unauthorized"
						: errorWhileVerifyingToken.message;
				return next(createError.Unauthorized(message));
			}
			// ? else attach the payload to the request
			request.payload = payload;
			next();
		}
	);
};

export { signAccessTokenOfUser, verifyAccessTokenOfUser };
