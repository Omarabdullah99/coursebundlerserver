import express from 'express'
import { allUser, getMyProfile, login, logout, register } from '../controllers/usersControllers.js'
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

router.route("/allusers").get(allUser)

export default router