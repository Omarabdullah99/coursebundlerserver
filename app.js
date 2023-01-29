import { config } from 'dotenv'
import express from 'express'
import ErrorMiddleware from './middlewares/Error.js'
config({
    path:"./config/config.env"
})
const app=express()

//using middlewares
app.use(express.json())
app.use(
    express.urlencoded({
        extended:true,
    })
)

//Importing and using Routes
import courses from './routes/courseRouters.js'
app.use("/api/v1",courses)

import users from "./routes/usersRouters.js"
app.use("/api/v1",users)
export default app
app.use(ErrorMiddleware)