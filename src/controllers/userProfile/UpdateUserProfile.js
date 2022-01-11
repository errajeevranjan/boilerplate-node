import print_error from "../../helpers/print_error.js";
import { ProfileSchema } from "../../helpers/ValidationHelper.js";
import UserModel from "../../models/UserModel.js";
import DecodeAccessToken from "../../helpers/tokens/DecodeAccessToken.js";

const UpdateUserProfile = async (request, response, next) => {
	try {
		const authHeaders = request.headers.authorization;
		// ? extracting id of the user whose profile is being updated from access_token
		const id = await DecodeAccessToken(authHeaders);
		const updates = request.body; // ? updates to be applied to the user's profile
		const options = { new: true }; // ? options to be used when updating the user's profile, it essentially returns the updated user's profile instead of previous one

		// check if the data entered by user is valid or not if yes execute the update else throw an error
		await ProfileSchema.validate(request.body);

		// update the user's profile
		await UserModel.findByIdAndUpdate(id, updates, options).exec();

		// send response code 204 and hit getUser profile on the client side
		response.sendStatus(204);
	} catch (error) {
		print_error("17 :: Error Occurred in UpdateUserProfile", error);
		next(error);
	}
};

export default UpdateUserProfile;
