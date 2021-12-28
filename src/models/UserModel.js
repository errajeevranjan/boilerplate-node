import bcrypt from "bcrypt";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		userId: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
		},
		mobile: {
			type: String,
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
		next(error);
	}
});

//  ? checking if the password entered by user is valid or not [called before signing in]
UserSchema.methods.isValidPassword = async function (password) {
	try {
		return await bcrypt.compare(password, this.password);
	} catch (error) {
		throw error;
	}
};

const UserModel = mongoose.model("user", UserSchema);
export default UserModel;
