import createError from "http-errors";
import JWT from "jsonwebtoken";
import print_error from "../print_error.js";

// ? function for decoding access_token and returning id that is inside it
const DecodeAccessToken = (access_token) =>
	new Promise((resolve, reject) => {
		const authHeaders = access_token;
		const bearerToken = authHeaders.split(" ");
		const token = bearerToken[1];

		JWT.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET,
			(errorVerifyingAccessToken, payload) => {
				if (errorVerifyingAccessToken) {
					print_error(
						"18 :: Error occurred in DecodeAccessToken",
						errorVerifyingAccessToken
					);

					reject(createError.Unauthorized());
				}
				// ? extracting id from access token and returning it back
				const id = payload.aud;
				resolve(id);
			}
		);
	});

export default DecodeAccessToken;
