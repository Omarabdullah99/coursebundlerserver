import {catchAsyncError} from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../utils/errorHandler.js"
import {Users} from "../models/Users.js"
import { sendToken } from "../utils/sendToken.js";
export const register=catchAsyncError(async(req,res,next)=>{
    const {name,email,password}=req.body;
    // const file=req.file;

    if(!name || !email || !password )
    return next(new ErrorHandler("please enter all register field",400));

    let user=await Users.findOne({email})
    if(user) return next(new ErrorHandler("User Already Exist", 409))

    //Uplad file on cloudinary;
    user=await Users.create({
        name,
        email,
        password,
        avatar:{
            public_id:"tempid",
            url:"tempurl",
        },

    })
    sendToken(res,user,"Register Successfully",201)


})


export const allUser=catchAsyncError(async(req,res,next)=>{

    let user=await Users.find()
    res.send(user)
    


})