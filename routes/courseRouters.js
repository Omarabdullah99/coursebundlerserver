import express from 'express'
import { addLecture, createCourse, getAllCourses, getCourseLectures } from '../controllers/courseControllers.js'
import singleUpload from '../middlewares/multer.js'
const router=express.Router()
//get all courses without lectures
router.route("/courses").get(getAllCourses)
//create new course -only admin
router.route("/createcourse").post(singleUpload,createCourse)

//Add Lecture, Delete Course,Get Course Details
router.route("/course/:id").get(getCourseLectures).post(singleUpload,addLecture)
 
export default router
