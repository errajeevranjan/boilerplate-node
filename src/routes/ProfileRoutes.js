import express from "express";
import UserSignIn from "../controllers/userAuth/UserSignIn.js";
import UserSignOut from "../controllers/userAuth/UserSignOut.js";
import DeleteUserProfile from "../controllers/userProfile/DeleteUserProfile.js";
import GetUserProfile from "../controllers/userProfile/GetUserProfile.js";
import UpdateUserProfile from "../controllers/userProfile/UpdateUserProfile.js";
import VerifyAccessToken from "../helpers/tokens/VerifyAccessToken.js";

const router = express.Router();

router.get("/:id", VerifyAccessToken, GetUserProfile);

router.patch("/:id", VerifyAccessToken, UpdateUserProfile);

router.delete("/:id", VerifyAccessToken, DeleteUserProfile);

export default router;
