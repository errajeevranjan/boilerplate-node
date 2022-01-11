import print_error from "../../../helpers/print_error.js";
import UserModel from "../../../models/user/UserModel.js";
import DecodeAccessToken from "../../../helpers/tokens/DecodeAccessToken.js";

const UserProfileDelete = async (request, response, next) => {
	try {
		const authHeaders = request.headers.authorization;
		// ? extracting id of the user whose profile is being deleted
		const id = await DecodeAccessToken(authHeaders);
		await UserModel.findByIdAndDelete(id);
		// now next step is to delete the refresh token from the db before sending the response
		response.sendStatus(204);
	} catch (error) {
		print_error("14 :: Error Occurred in UserProfileDelete", error);
		next(error);
	}
};

export default UserProfileDelete;
