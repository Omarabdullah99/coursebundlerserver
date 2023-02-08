import {catchAsyncError} from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../utils/errorHandler.js"
import {Users} from "../models/Users.js"
import {Course} from "../models/Course.js"
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from 'crypto'
import getDataUri from "../utils/dataurl.js";
import cloudinary from 'cloudinary'
export const register=catchAsyncError(async(req,res,next)=>{
    const {name,email,password}=req.body;
    
    if(!name || !email || !password )
    return next(new ErrorHandler("please enter all register field",400));

    let user=await Users.findOne({email})
    if(user) return next(new ErrorHandler("User Already Exist", 409))

    //Uplad file on cloudinary;
    const file=req.file;
    const fileUri= getDataUri(file)
    const mycloud= await cloudinary.v2.uploader.upload(fileUri.content)
    user=await Users.create({
        name,
        email,
        password,
        avatar:{
            public_id:mycloud.public_id,
            url:mycloud.secure_url,
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
    const file=req.file;
    const user=await Users.findById(req.user._id)
    const fileUri= getDataUri(file)
    const mycloud= await cloudinary.v2.uploader.upload(fileUri.content)
    await cloudinary.v2.uploader.destroy(user.avatar.public_id)
    user.avatar={
        public_id:mycloud.public_id,
        url:mycloud.secure_url,
    };
    await user.save()
    res.status(200).json({
        success:true,
        message:"Profile Picture Update Successfully"
    })
})

export const forgerPassword=catchAsyncError(async(req,res,next)=>{
    const {email}=req.body;
    const user=await Users.findOne({email});
    // console.log(email)

    if(!user) return next(new ErrorHandler("User not found",400))

    const resetToken=await user.getResetToken()
    await user.save()
    const url=`${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
    const  message=`Click on the link to reset your password. ${url}. If you have not request then please ignore`
    //send token via email
    console.log("check forgetpassword1")
   await sendEmail(user.email,"CourseBundler Reset Password",message)
   console.log("check forgetpassword2")
    res.status(200).json({
        success:true,
        message:`Reset Token has been sent to ${user.email}`
    })
})

export const resetPassword=catchAsyncError(async(req,res,next)=>{
    const {token}=req.params;
     const resetPasswordToken=crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")

    const user=await Users.findOne({
        resetPasswordToken,
        resetPasswordExpire:{
            $gt: Date.now()
        },
        
    })
    if(!user) return next(new ErrorHandler("Token is invalid or has been expired",401))

    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save()
    res.status(200).json({
        success:true,
        message:"password changed Successfully",
        
    })
})

export const addToPlaylist=catchAsyncError(async(req,res,next)=>{
    const user=await Users.findById(req.user._id)

    const course=await Course.findById(req.body.id);
    if(!course) return next(new ErrorHandler("Invalid Course Id",404))

    const itemExist=user.playlist.find((item)=>{
        if(item.course.toString()=== course._id.toString()) return true
    })
    if(itemExist) return next(new ErrorHandler("Item Already Exist",409))

    user.playliest.push({
        course:course._id,
        poster:course.poster.url
    })
    await user.save()

    res.status(200).json({
        success:true,
        message:"Added to playlist",
        
    })


})

export const removeFromPlaylist=catchAsyncError(async(req,res,next)=>{

    const user=await Users.findById(req.user._id)
    const course=await Course.findById(req.query.id);
    if(!course) return next(new ErrorHandler("Invalid Course Id",404))

    const newPlaylist=user.playlist.filter((item)=>{
        if(item.course.toString()!== course._id.toString()) return item
    })

    user.playlist=newPlaylist
    await user.save()

    res.status(200).json({
        success:true,
        message:"Remove from playlist",
        
    })

    
})





export const allUser=catchAsyncError(async(req,res,next)=>{

    let user=await Users.find()
    res.send(user)
    


})