import express from 'express'
import { createCourse, getAllCourses } from '../controllers/courseControllers.js'
const router=express.Router()
//get all courses without lectures
router.route("/courses").get(getAllCourses)
//create new course -only admin
router.route("/createcourse").post(createCourse)
export default router
