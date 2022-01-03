import createError from "http-errors";
import print_error from "../../helpers/print_error.js";
import { ProfileSchema } from "../../helpers/ValidationHelper.js";
import UserModel from "../../models/UserModel.js";

const UpdateUserProfile = async (request, response, next) => {
	try {
		const id = request.params.id; // ? id of the user whose profile is being updated
		const updates = request.body; // ? updates to be applied to the user's profile
		const options = { new: true }; // ? options to be used when updating the user's profile, it essentially returns the updated user's profile instead of previous one

		const result = await ProfileSchema.validate(request.body);
		const { userId } = result;

		if (!userId) {
			throw createError.NotFound(
				`Request cannot be processed, please try again.`
			);
		}

		const updatedProfile = await UserModel.findByIdAndUpdate(
			id,
			updates,
			options
		).exec();
		// send response code 204 and hit getuser profile on the client side
		response.sendStatus(204);
	} catch (error) {
		print_error("17 :: Error Occurred in UpdateUserProfile", error);
		next(error);
	}
};

export default UpdateUserProfile;
