import * as yup from "yup";
import { emailRegex, phoneRegex } from "../utils/Regex.js";

const SignUpSchema = yup.object().shape({
	email: yup
		.string()
		.required("Please enter your email")
		.test("testing-email-validation", "Enter Valid Email", (value) => {
			const isValidEmail = emailRegex.test(value);
			if (!isValidEmail) {
				return false;
			}
			return true;
		}),

	mobile: yup
		.string()
		.required("Please enter your mobile")
		.test("testing-mobile-validation", "Enter Valid Mobile", (value) => {
			const isValidPhone = phoneRegex.test(value);
			if (!isValidPhone) {
				return false;
			}
			return true;
		}),
	password: yup
		.string()
		.max(12, "password must be between 6 and 12 characters long.")
		.min(6, "password must be between 6 and 12 characters long.")
		.required("Provide valid password"),
});

const SignInSchema = yup.object().shape({
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

const ProfileSchema = yup.object().shape({
	name: yup.string(),
	gender: yup.string(),
	address: yup.string(),
	email: yup
		.string()
		.test("testing-email-validation", "Enter Valid Email", (value) => {
			const isValidEmail = emailRegex.test(value);
			if (!isValidEmail) {
				return false;
			}
			return true;
		}),

	mobile: yup
		.string()
		.test("testing-mobile-validation", "Enter Valid Mobile", (value) => {
			const isValidPhone = phoneRegex.test(value);
			if (!isValidPhone) {
				return false;
			}
			return true;
		}),
});

export { SignUpSchema, SignInSchema, ProfileSchema };
