import chalk from "chalk";
import createError from "http-errors";
import JWT from "jsonwebtoken";

// ? middleware for checking access-token in header
// ! if token exists and is valid user will gain access to protected routes
const VerifyAccessToken = (request, response, next) => {
	// ? if there is no authorization header in the request throw error
	if (!request.headers.authorization) return next(createError.Unauthorized());
	// ? if there is authorization header in the request then extract token from it
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
				console.log(
					chalk.red(
						"Failed to verify access-token : ",
						errorWhileVerifyingToken
					)
				);
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

export default VerifyAccessToken;
