import express from 'express'
import { allUser, chnagePassword, getMyProfile, login, logout, register, updateProfile, updateprofilepicture } from '../controllers/usersControllers.js'
import { isAuthenticated } from '../middlewares/auth.js'

const router=express.Router()

//register router
router.route("/register").post(register)
//login router
router.route("/login").post(login)
//logout
router.route("/logout").get(logout)

//get my profile
router.route("/me").get(isAuthenticated,getMyProfile)

//change password
router.route("/changepassword").put(isAuthenticated,chnagePassword)
//update profile
router.route("/updateprofile").put(isAuthenticated,updateProfile)
//update profile picture
router.route("/updateprofilepicture").put(isAuthenticated,updateprofilepicture)
router.route("/allusers").get(allUser)

export default router