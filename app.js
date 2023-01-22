import { config } from 'dotenv'
import express from 'express'
config({
    path:"./config/config.env"
})
const app=express()
export default app