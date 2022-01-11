import createError from "http-errors";
import JWT from "jsonwebtoken";
import print_error from "../print_error.js";

//? function for signing access token using user's DB id
const SignAccessToken = (id) =>
	new Promise((resolve, reject) => {
		// ? creating payload
		const payload = { id };
		// ? creating secret
		const secret = process.env.ACCESS_TOKEN_SECRET;
		// ? setting options
		const options = {
			expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
			issuer: process.env.TOKEN_ISSUER,
			audience: id,
		};

		// ? signing token
		JWT.sign(
			payload,
			secret,
			options,
			(errorWhileSigningAccessToken, token) => {
				if (errorWhileSigningAccessToken) {
					print_error("28 :: SignAccessToken.js", errorWhileSigningAccessToken);
					reject(createError.InternalServerError());
				}
				resolve(token);
			}
		);
	});
export default SignAccessToken;
