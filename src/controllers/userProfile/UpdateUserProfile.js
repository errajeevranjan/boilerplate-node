import print_error from "../../helpers/print_error.js";
import UserModel from "../../models/UserModel.js";

const UpdateUserProfile = async (request, response, next) => {
	try {
		const id = request.params.id; // ? id of the user whose profile is being updated
		const updates = request.body; // ? updates to be applied to the user's profile
		const options = { new: true }; // ? options to be used when updating the user's profile, it essentially returns the updated user's profile instead of previous one

		const updatedProfile = await UserModel.findByIdAndUpdate(
			id,
			updates,
			options
		).exec();
		response.send(updatedProfile);
	} catch (error) {
		print_error("17 :: Error Occurred in UpdateUserProfile", error);
		next(error);
	}
};

export default UpdateUserProfile;
