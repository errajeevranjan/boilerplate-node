import print_error from "../../helpers/print_error.js";
import UserModel from "../../models/UserModel.js";
import DecodeAccessToken from "../../helpers/tokens/DecodeAccessToken.js";

const DeleteUserProfile = async (request, response, next) => {
	try {
		const authHeaders = request.headers.authorization;
		// ? extracting id of the user whose profile is being deleted
		const id = await DecodeAccessToken(authHeaders);
		await UserModel.findByIdAndDelete(id);
		// now next step is to delete the refresh token from the db before sending the response
		response.sendStatus(204);
	} catch (error) {
		print_error("19 :: Error Occurred in DeleteUserProfile", error);
		next(error);
	}
};

export default DeleteUserProfile;
