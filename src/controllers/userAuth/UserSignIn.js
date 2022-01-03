import createError from "http-errors";
import print_error from "../../helpers/print_error.js";
import SignAccessToken from "../../helpers/tokens/SignAccessToken.js";
import SignRefreshToken from "../../helpers/tokens/SignRefreshToken.js";
import { AuthSchema } from "../../helpers/ValidationHelper.js";
import UserModel from "../../models/UserModel.js";

const UserSignIn = async (request, response, next) => {
	try {
		// ? checking if user has entered valid email/mobile and password
		const result = await AuthSchema.validate(request.body);
		const { userId } = result;

		// ? searching if the email/mobile that user has entered exists in the database
		const user = await UserModel.findOne({
			userId,
		});

		// ? if user does not exist throw an error and ask them to sign up
		if (!user) {
			throw createError.NotFound(`${userId} does not exist, please sign up.`);
		}

		// ? if user does exist validate the password they entered
		const isMatch = await user.isPasswordValid(result.password);
		// ? if password validation fails throw an error and ask them to try again
		if (!isMatch)
			throw createError.Unauthorized(
				"Invalid login credentials, please check and try again"
			);

		// ? if password validation succeeds then send the user access token and refresh token
		const { id } = user;
		const access_token = await SignAccessToken(id);
		const refresh_token = await SignRefreshToken(id);

		response.setHeader(
			"Set-Cookie",
			`refresh_token=${refresh_token}; HttpOnly`
		);
		response.send({ access_token });
	} catch (error) {
		print_error("39 :: UserSignIn.js", error);
		next(error);
	}
};

export default UserSignIn;
