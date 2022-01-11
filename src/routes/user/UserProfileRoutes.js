import express from "express";
import UserProfileDelete from "../../controllers/user/profile/UserProfileDelete.js";
import UserProfileFetch from "../../controllers/user/profile/UserProfileFetch.js";
import UserProfileUpdate from "../../controllers/user/profile/UserProfileUpdate.js";
import VerifyAccessToken from "../../helpers/tokens/VerifyAccessToken.js";

const router = express.Router();

router.get("/", VerifyAccessToken, UserProfileFetch);

router.patch("/", VerifyAccessToken, UserProfileUpdate);

router.delete("/", VerifyAccessToken, UserProfileDelete);

export default router;
