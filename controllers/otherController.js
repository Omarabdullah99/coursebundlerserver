import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import {sendEmail} from '../utils/sendEmail.js'
import { Stats } from "../models/Stats.js";

export const contact=catchAsyncError(async(req,res,next)=>{
    const {name,email,message}=req.body;

    if(!name || !email || !message)
    return next(new ErrorHandler("All fields are mandatory"))

    const to=process.env.MY_MAIL
    const subject="Contact from CourseBundler"
    const text=`I am ${name} and my Email is ${email}. \n${message}`

    await sendEmail(to,subject,text)

    res.status(200).json({
        success:true,
        message:"Your message has been send"
    })
})

export const courseRequest=catchAsyncError(async(req,res,next)=>{
    const {name,email,course}=req.body;

    if(!name || !email || !course)
    return next(new ErrorHandler("All fields are mandatory"))

    const to=process.env.MY_MAIL
    const subject="Request for a course on CourseBundler"
    const text=`I am ${name} and my Email is ${email}. \n${course}`

    await sendEmail(to,subject,text)

    res.status(200).json({
        success:true,
        message:"Your request course has been send"
    })
})

export const getDashboardStats=catchAsyncError(async(req,res,next)=>{
    const stats=await Stats.find({}).sort({createdAt:"desc"}).limit(12)
    
    const statsData=[]
   

    for(let i=0; i<stats.length; i++){
        statsData.unshift(stats[i])
    }
  

    const requiredSize=12-stats.length

    for (let i = 0; i < requiredSize; i++) {
        
        statsData.unshift({
            user:0,
            subscription:0,
            views:0
        })
    }
    const userCount=statsData[11].user;
    const subscriptionCount=statsData[11].subscription;
    const viewsCount=statsData[11].views;

    let userPercentage=0,
    viewsPercentage=0,
    subscriptionPercentage=0 
    let userProfit=true,
    viewsProfit=true,
    subscriptionProfit=true 

    if(statsData[10].user === 0) userPercentage=userCount * 100
    if(statsData[10].views === 0) viewsPercentage=viewsCount * 100
    if(statsData[10].subscription === 0) subscriptionPercentage=subscriptionCount * 100

    else{
        const difference={
            user:statsData[11].user - statsData[10].user,
            views:statsData[11].views - statsData[10].views,
            subscription:statsData[11].subscription - statsData[10].subscription,
        }
        userPercentage=(difference.user / statsData[10].user) * 100;
        viewsPercentage=(difference.views / statsData[10].views) * 100;
        subscriptionPercentage=(difference.subscription / statsData[10].subscription) * 100;

        if(userPercentage <0) userProfit=false;
        if(viewsPercentage <0) viewsProfit=false;
        if(subscriptionPercentage <0) subscriptionProfit=false;
    }

    res.status(200).json({
        success:true,
        stats:statsData,
        userCount,
        subscriptionCount,
        viewsCount,
        userPercentage,
        viewsPercentage,
        subscriptionPercentage,
        userProfit,
        viewsProfit,
        subscriptionProfit
    })
})