import chalk from "chalk";
import createError from "http-errors";
import AuthSchema from "../../helpers/ValidationHelper.js";
import UserModel from "../../models/UserModel.js";

const UserSignOut = async (request, response, next) => {
	try {
		// ? checking if user has entered valid email/mobile and password
		const result = await AuthSchema.validate(request.body);
		// ? searching if the email/mobile that user has entered exists in the database
		const { userId } = result;
		const doesExist = await UserModel.findOne({ userId });
		// ! if the email/mobile that user has entered exists in the database throw an error that will be catch block on line 21
		if (doesExist) {
			throw createError.Conflict(
				`${userId} already exists, please log in or try again with different credentials.`
			);
		}
		// ! if the email/mobile is not found in the database then figure out if user has entered an email or mobile and fill that in respective field of user model and after that respond with access_token and refresh_token
		else {
			const user = new UserModel({ userId, password });
			const savedUser = await user.save();
			response.send(savedUser);
		}
	} catch (error) {
		console.log(chalk.red("error", error));
		next(error);
	}
};

export default UserSignOut;
