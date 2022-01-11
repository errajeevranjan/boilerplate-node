//  function that takes cookie and extracts refresh token from it using substring method
const ExtractRefreshToken = (cookie) =>
	cookie.substring(cookie.indexOf("=") + 1, cookie.lastIndexOf(""));

export default ExtractRefreshToken;
