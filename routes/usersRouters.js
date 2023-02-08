import express from 'express'
import { addToPlaylist, allUser, chnagePassword, forgerPassword, getMyProfile, login, logout, register, removeFromPlaylist, resetPassword, updateProfile, updateprofilepicture } from '../controllers/usersControllers.js'
import { isAuthenticated } from '../middlewares/auth.js'
import singleUpload from "../middlewares/multer.js"
const router=express.Router()

//register router
router.route("/register").post(singleUpload,register)
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
router.route("/updateprofilepicture").put(isAuthenticated,singleUpload,updateprofilepicture)
//forgetPassowrd
router.route("/forgetpassword").post(forgerPassword)
//resetPassword
router.route("/resetpassword/:token").put(resetPassword)

//addtoplaylist connnect to courses
router.route("/addtoplaylist").post(isAuthenticated,addToPlaylist)
//remove from playlist conntect to courses
router.route("/removefromplaylist").delete(isAuthenticated,removeFromPlaylist)
router.route("/allusers").get(allUser)

export default router