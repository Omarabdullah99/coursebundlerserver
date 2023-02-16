import express from 'express'
import { addLecture, createCourse, deleteCourse, deleteLecture, getAllCourses, getCourseLectures } from '../controllers/courseControllers.js'
import { authorizedAdmin, authorizeSubscribers, isAuthenticated } from '../middlewares/auth.js'
import singleUpload from '../middlewares/multer.js'
const router=express.Router()
//get all courses without lectures
router.route("/courses").get(getAllCourses)
//create new course -only admin
router.route("/createcourse").post(isAuthenticated,authorizedAdmin,singleUpload,createCourse)

//Add Lecture, Delete Course,Get Course Details
router.route("/course/:id").get(isAuthenticated,authorizeSubscribers,getCourseLectures).post(isAuthenticated,authorizedAdmin,singleUpload,addLecture).delete(isAuthenticated,authorizedAdmin,deleteCourse)
 //Delete lecture
 router.route("/lecture").delete(isAuthenticated,authorizedAdmin,deleteLecture);
 
export default router
