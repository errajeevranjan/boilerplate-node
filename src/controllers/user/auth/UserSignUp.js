import createError from "http-errors";
import print_error from "../../../helpers/print_error.js";
import SignAccessToken from "../../../helpers/tokens/SignAccessToken.js";
import SignRefreshToken from "../../../helpers/tokens/SignRefreshToken.js";
import { SignUpSchema } from "../../../helpers/ValidationHelper.js";
import UserModel from "../../../models/user/UserModel.js";

const UserSignUp = async (request, response, next) => {
	try {
		// ? checking if user has entered valid email,mobile and password
		const result = await SignUpSchema.validate(request.body);

		const { email, mobile, password } = result;

		// ? searching if the email or mobile that user has entered exists in the database
		const doesExist = await UserModel.findOne({ $or: [{ email }, { mobile }] });

		// ? if the email or mobile that user has entered exists in the database throw an error that will be caught by catch block on line 42
		if (doesExist) {
			throw createError.Conflict(
				`${email} / ${mobile} already exists, please log in.`
			);
		}

		// ? if the email or mobile that user has entered does not exist in the database then create a new user
		const user = new UserModel({ email, mobile, password });
		const savedUser = await user.save(); // user details saved in the database
		// ? extracting id from user object and sign access token and refresh token
		const { id } = savedUser;
		// ? sign access token and refresh token
		const access_token = await SignAccessToken(id);
		const refresh_token = await SignRefreshToken(id);

		// ? setting new refresh token in cookie of client
		response.setHeader(
			"Set-Cookie",
			`refresh_token=${refresh_token}; HttpOnly`
		);

		// ? sending access_token to the client
		response.send({ access_token });
	} catch (error) {
		print_error("43 :: Error occurred in", error);
		next(error);
	}
};

export default UserSignUp;
