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


export const login=catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;
    // const file=req.file;

    if( !email || !password )
    return next(new ErrorHandler("please enter all register field",400));

    const user=await Users.findOne({email}).select("+password")
    if(!user) return next(new ErrorHandler("Incorrect Email or Password", 401))

    const isMatch=await user.comparePassword(password)
    if(!isMatch) return next(new ErrorHandler("Incorrect Email or Password",401))

    sendToken(res,user,`Welcome back, ${user.name}`,200)

})

export const logout=catchAsyncError(async (req,res,next)=>{
    res.status(200).cookie("token",null,{
        expires:new Date(Date.now()),
    }).json({
        success:true,
        message:"Logout successfully"

    })
})

export const getMyProfile=catchAsyncError(async (req,res,next)=>{
    const user=await Users.findById(req.user._id)
    res.status(200).json({
        success:true,
       user,

    })
})

export const chnagePassword=catchAsyncError(async (req,res,next)=>{
    const {oldPassword,newPassword}=req.body
    if(!oldPassword || !newPassword)
    return next(new ErrorHandler("please enter all field",400))

    const user=await Users.findById(req.user._id).select("+password")

    const isMatch=await user.comparePassword(oldPassword)
    if(!isMatch) return next(new ErrorHandler("Incorrect old password",400))
    user.password=newPassword
    await user.save()
    res.status(200).json({
        success:true,
       message:"Password Changed successfully"

    })
})

export const updateProfile=catchAsyncError(async (req,res,next)=>{
    const {name,email}=req.body
    const user=await Users.findById(req.user._id)

    if(name) user.name=name;
    if(email) user.email=email


    await user.save()
    res.status(200).json({
        success:true,
       message:"Profile updated successfully"

    })
})

export const updateprofilepicture=catchAsyncError(async(req,res,next)=>{
    //cloudinary:TODO
    res.status(200).json({
        success:ture,
        message:"Profile Picture Update Successfully"
    })
})


export const allUser=catchAsyncError(async(req,res,next)=>{

    let user=await Users.find()
    res.send(user)
    


})