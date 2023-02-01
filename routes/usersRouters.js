import express from 'express'
import { allUser, register } from '../controllers/usersControllers.js'

const router=express.Router()
router.route("/register").post(register)
router.route("/allusers").get(allUser)

export default router