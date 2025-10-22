import {Router} from "express"

import {
    changeCurrentPassword,
    getCurrentUser,
    loginUser,
    adminLogin,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateUserAvatar,
    promoteToAdmin,
    getAllUsers,
    getUserById
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {verifyAdmin} from "../middlewares/admin.middleware.js"
const router = Router()

router.route("/register").post(
	upload.fields([
		{
			name: "avatar",
			maxCount: 1,
		},
	]),
	registerUser
);

// authentication routes
router.route('/login').post(loginUser)
router.route('/admin/login').post(adminLogin)

// secured routes
router.route('/logout').post(verifyJWT,logoutUser)
router.route('/current-user').get(verifyJWT,getCurrentUser)
router.route('/change-password').post(verifyJWT,changeCurrentPassword)
router.route('/update-account').patch(verifyJWT,updateAccountDetails)
router.route("/refresh-token").post(refreshAccessToken);
router
	.route("/avatar")
	.patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

// admin only routes
router.route('/admin/users').get(verifyJWT, verifyAdmin, getAllUsers)
router.route('/admin/users/:userId').get(verifyJWT, verifyAdmin, getUserById)
router.route('/admin/promote/:userId').patch(verifyJWT, verifyAdmin, promoteToAdmin)

export default router