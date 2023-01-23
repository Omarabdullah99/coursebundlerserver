import { config } from 'dotenv'
import express from 'express'
config({
    path:"./config/config.env"
})
const app=express()

//Importing and using Routes
import courses from './routes/courseRouters.js'
app.use("/api/v1",courses)

import users from "./routes/usersRouters.js"
app.use("/api/v1",users)
export default app