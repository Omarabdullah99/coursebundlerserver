import { config } from 'dotenv'
import express from 'express'
import ErrorMiddleware from './middlewares/Error.js'
import cookieParser from 'cookie-parser'
import cors from "cors"
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
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(cookieParser())

//Importing and course Routes
import courses from './routes/courseRouters.js'
app.use("/api/v1",courses)


//import users route
import users from "./routes/usersRouters.js"
app.use("/api/v1",users)

//import payment route
import Paymet from "./routes/paymentRoute.js"
app.use("/api/v1",Paymet)
//import othercontroller route
import othercontroller from './routes/otherRoutes.js'
app.use("/api/v1",othercontroller)

export default app
app.use(ErrorMiddleware)