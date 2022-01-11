import bcrypt from "bcrypt";
import mongoose from "mongoose";
import print_error from "../../helpers/print_error.js";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		name: {
			type: String,
		},
		gender: {
			type: String,
		},
		address: {
			type: String,
		},
		/* auth related */
		email: {
			type: String,
			required: true,
			unique: true,
		},
		mobile: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

// ? before saving a user, hash the password then save hashed password in the database [called before signing up]
UserSchema.pre("save", async function (next) {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(this.password, salt);
		this.password = hashedPassword;
		next();
	} catch (error) {
		print_error("38 :: UserModel.js", error);
		next(error);
	}
});

//  ? checking if the password entered by user is valid or not [called before signing in]
UserSchema.methods.isPasswordValid = async function (password) {
	try {
		return await bcrypt.compare(password, this.password);
	} catch (error) {
		print_error("48 :: UserModel.js", error);
		throw error;
	}
};

const UserModel = mongoose.model("user", UserSchema);
export default UserModel;
