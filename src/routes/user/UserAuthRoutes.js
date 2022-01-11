import express from "express";
import UserRefreshToken from "../../controllers/user/auth/UserRefreshToken.js";
import UserSignIn from "../../controllers/user/auth/UserSignIn.js";
import UserSignOut from "../../controllers/user/auth/UserSignOut.js";
import UserSignUp from "../../controllers/user/auth/UserSignUp.js";

const router = express.Router();

router.post("/sign-up", UserSignUp);

router.post("/sign-in", UserSignIn);

router.post("/refresh-token", UserRefreshToken);

router.delete("/sign-out", UserSignOut);

export default router;
