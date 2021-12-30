import chalk from "chalk";

const print_error = (message, error) =>
	console.log(chalk.redBright(`${message} ::`), chalk.magentaBright(error));

export default print_error;
