import createError from "http-errors";
import JWT from "jsonwebtoken";
import print_error from "../print_error.js";

// ? middleware for checking access-token and it's validity to give access to protected routes

const VerifyAccessToken = (request, response, next) => {
	// ? if there is no authorization header in the request throw error
	if (!request.headers.authorization) return next(createError.Unauthorized());

	// ? if there is authorization header in the request then extract token from it and remove "Bearer " from it and pass it to verify function
	const authHeaders = request.headers.authorization;
	const bearerToken = authHeaders.split(" ");
	const token = bearerToken[1];

	// ? verifying token
	JWT.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET,
		(errorVerifyingToken, payload) => {
			// ? if there is an error in verifying token throw error
			if (errorVerifyingToken) {
				print_error("24 :: VerifyAccessToken.js", errorVerifyingToken);
				const message =
					errorVerifyingToken.name === "JsonWebTokenError"
						? "Unauthorized"
						: errorVerifyingToken.message;
				return next(createError.Unauthorized(message));
			}
			// ? else attach the payload to the request
			request.payload = payload;
			next();
		}
	);
};

export default VerifyAccessToken;
