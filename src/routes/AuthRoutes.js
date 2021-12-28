import express from "express";
import UserRefreshToken from "../controllers/userAuth/UserRefreshToken.js";
import UserSignIn from "../controllers/userAuth/UserSignIn.js";
import UserSignOut from "../controllers/userAuth/UserSignOut.js";
import UserSignUp from "../controllers/userAuth/UserSignUp.js";

const router = express.Router();

router.post("/sign-up", UserSignUp);

router.post("/sign-in", UserSignIn);

router.post("/refresh-token", UserRefreshToken);

router.delete("/sign-out", UserSignOut);

export default router;
