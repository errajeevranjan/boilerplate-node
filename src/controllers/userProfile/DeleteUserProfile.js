import print_error from "../../helpers/print_error.js";
import UserModel from "../../models/UserModel.js";

const DeleteUserProfile = async (request, response, next) => {
	try {
		const id = request.params.id; // ? id of the user whose profile is being deleted

		const result = await UserModel.findByIdAndDelete(id);
		// now next step is to delete the refresh token from the db before sending the response
		response.send(result);
	} catch (error) {
		print_error("19 :: Error Occurred in DeleteUserProfile", error);
		next(error);
	}
};

export default DeleteUserProfile;
