import express from 'express'
import { allUser, login, logout, register } from '../controllers/usersControllers.js'

const router=express.Router()

//register router
router.route("/register").post(register)
//login router
router.route("/login").post(login)
//logout
router.route("/logout").get(logout)


router.route("/allusers").get(allUser)

export default router