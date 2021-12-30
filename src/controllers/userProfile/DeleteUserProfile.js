// import DecodeAccessToken from "../../helpers/tokens/DecodeAccessToken.js";
// import UserModel from "../../models/UserModel.js";
import print_error from "../../helpers/print_error.js";

const DeleteUserProfile = async (request, response, next) => {
	try {
		/* to delete a user profile we will ask user to provide password
  we will then validate that password
  if password is valid then we will delete the user profile and clear token  from redis as well as client's local storage
  if password is invalid then we will throw error
  */
	} catch (error) {
		print_error("13 :: Error Occurred in DeleteUserProfile", error);
		next(error);
	}
};

export default DeleteUserProfile;
