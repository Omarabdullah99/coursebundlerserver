import jwt from "jsonwebtoken"
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js"
import { Users } from "../models/Users.js";

export const isAuthenticated=catchAsyncError(async(req,res,next)=>{
    const {token}=req.cookies;

    if(!token) return next(new ErrorHandler("Not LOgged In",401))

    const decoded=jwt.verify(token, process.env.JWT_SECRET )
    req.user=await Users.findById(decoded._id)
    next()
})

export const authorizedAdmin=(req,res,next)=>{
    if (req.user.role !== "admin")
    return next(
      new ErrorHandler(
        `${req.user.role} is not allowed to access this resource`,
        403
      )
    );

  next();
  

}
export const authorizeSubscribers=(req,res,next)=>{
  if (req.user.subscription.status!=="active" && req.user.role !== "admin")
  return next(
    new ErrorHandler(
      `only subscribers can access this resource`,
      403
    )
  );

next();


}