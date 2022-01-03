import print_error from "../../helpers/print_error.js";
import UserModel from "../../models/UserModel.js";

const GetUserProfile = async (request, response, next) => {
	try {
		const id = request.params.id; // ? id of the user whose profile needs to be fetched

		// ? get user's profile data [excluding password] using id
		const user = await UserModel.findById(id).select("-password");

		if (!user) {
			throw createError.NotFound(
				`That user does not exists in our database, please sign up.`
			);
		}

		// ? sending user's profile data to client
		response.send({ profile: user });
	} catch (error) {
		print_error("20 :: Error occurred in GetUserProfile ", error);

		next(error);
	}
};

export default GetUserProfile;
