import createError from "http-errors";
import print_error from "../../helpers/print_error.js";
import SignAccessToken from "../../helpers/tokens/SignAccessToken.js";
import SignRefreshToken from "../../helpers/tokens/SignRefreshToken.js";
import AuthSchema from "../../helpers/ValidationHelper.js";
import UserModel from "../../models/UserModel.js";

const UserSignUp = async (request, response, next) => {
	try {
		// ? checking if user has entered valid email/mobile and password
		const result = await AuthSchema.validate(request.body);

		// ? searching if the email/mobile that user has entered exists in the database
		const { userId, password } = result;
		const doesExist = await UserModel.findOne({ userId });
		// ? if the email/mobile that user has entered exists in the database throw an error that will be catch block on line 41
		if (doesExist) {
			throw createError.Conflict(
				`${userId} already exists, please log in or try again with different credentials.`
			);
		}
		// ? if the email/mobile is not found in the database then save user in the database
		else {
			// ? if user has entered an email or mobile then save it in respective field of user model
			let email = "";
			let mobile = "";
			if (result.userId.includes("@")) {
				email = result.userId;
			} else {
				mobile = result.userId;
			}

			const user = new UserModel({ userId, password, email, mobile });
			const savedUser = await user.save(); // user details saved in the database
			const { id } = savedUser;
			const access_token = await SignAccessToken(id); // access token generated for the user
			const refresh_token = await SignRefreshToken(id); // refresh token generated for the user
			// ! sending tokens to the client
			response.setHeader(
				"Set-Cookie",
				`refresh_token=${refresh_token}; HttpOnly`
			);
			response.send({ access_token });
		}
	} catch (error) {
		print_error("43 :: Error occurred in", error);
		next(error);
	}
};

export default UserSignUp;
