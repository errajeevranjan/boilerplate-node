import createError from "http-errors";
import print_error from "../../../helpers/print_error.js";
import DecodeAccessToken from "../../../helpers/tokens/DecodeAccessToken.js";
import UserModel from "../../../models/user/UserModel.js";

const UserProfileFetch = async (request, response, next) => {
	try {
		const authHeaders = request.headers.authorization;
		// ? extracting id of the user whose profile is being fetched
		const id = await DecodeAccessToken(authHeaders);
		// ? get user's profile data [excluding password] using id
		const user = await UserModel.findById(id).select("-password -_id");

		if (!user) {
			throw createError.NotFound(
				`That user does not exists in our database, please sign up.`
			);
		}

		// ? sending user's profile data to client
		response.send({ profile: user });
	} catch (error) {
		print_error("22 :: Error occurred in UserProfileFetch ", error);

		next(error);
	}
};

export default UserProfileFetch;
