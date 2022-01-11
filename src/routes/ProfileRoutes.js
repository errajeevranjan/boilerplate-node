import express from "express";
import DeleteUserProfile from "../controllers/userProfile/DeleteUserProfile.js";
import GetUserProfile from "../controllers/userProfile/GetUserProfile.js";
import UpdateUserProfile from "../controllers/userProfile/UpdateUserProfile.js";
import VerifyAccessToken from "../helpers/tokens/VerifyAccessToken.js";

const router = express.Router();

router.get("/", VerifyAccessToken, GetUserProfile);

router.patch("/", VerifyAccessToken, UpdateUserProfile);

router.delete("/", VerifyAccessToken, DeleteUserProfile);

export default router;
