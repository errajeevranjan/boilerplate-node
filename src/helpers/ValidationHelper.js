import * as yup from "yup";
import { emailRegex, phoneRegex } from "../utils/Regex.js";

const AuthSchema = yup.object().shape({
	userId: yup
		.string()
		.required("Provide valid email OR mobile")
		.test(
			"test-if-user-is-entering-valid-email-or-mobile",
			"Enter Valid Phone/Email",
			(value) => {
				const isValidEmail = emailRegex.test(value);
				const isValidPhone = phoneRegex.test(value);
				if (!isValidEmail && !isValidPhone) {
					return false;
				}
				return true;
			}
		),
	password: yup
		.string()
		.max(12, "password must be between 6 and 12 characters long.")
		.min(6, "password must be between 6 and 12 characters long.")
		.required("Provide valid password"),
});
export default AuthSchema;
