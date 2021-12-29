import chalk from "chalk";
import createError from "http-errors";
import JWT from "jsonwebtoken";

const SignAccessToken = (id) =>
	new Promise((resolve, reject) => {
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
export default SignAccessToken;
