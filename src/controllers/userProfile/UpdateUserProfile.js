import print_error from "../../helpers/print_error.js";

const UpdateUserProfile = async (request, response, next) => {
	try {
		/* get new data from req.body that user wants to be patched up to their document
    append that data to the db
    send the updated profile back to the client
    */
	} catch (error) {
		print_error("10 :: Error Occurred in UpdateUserProfile", error);
		next(error);
	}
};

export default UpdateUserProfile;
