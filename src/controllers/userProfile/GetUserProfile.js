import DecodeAccessToken from "../../helpers/tokens/DecodeAccessToken.js";
import UserModel from "../../models/UserModel.js";
import print_error from "../../helpers/print_error.js";

const GetUserProfile = async (request, response, next) => {
	try {
		//? extracting authorization header from request
		/* since the middle ware is protecting the route, so we need not verify if the header has access_token or not */
		const access_token = request.headers.authorization;

		// ? getting id from access_token to find that user in database
		const id = await DecodeAccessToken(access_token);

		/* we need to check if the user exists or not even though we are always receiving valid id inside payload as user can delete their account and then hit the api with valid access token and we want to prevent the application from breaking in that case */

		// ? get user's profile data [excluding password] using id
		const user = await UserModel.findById(id).select("-password");

		if (!user) {
			throw createError.NotFound(
				`${userId} does not exists in our database, please sign up.`
			);
		}

		// ? send user's profile data to client
		response.send({ profile: user });
	} catch (error) {
		print_error("28 :: Error occurred in GetUserProfile ", error);

		next(error);
	}
};

export default GetUserProfile;
