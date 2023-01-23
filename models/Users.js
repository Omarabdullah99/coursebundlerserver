import mongoose from 'mongoose'
const schema=new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
      },
      email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: validator.isEmail,
      },
    
      password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Password must be at least 6 characters"],
        select: false,
      },
      role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
      },
    
      subscription: {
        id: String,
        status: String,
      },
    
      avatar: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
      playlist: [
        {
          course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
          },
          poster: String,
        },
      ],
    
      createdAt: {
        type: Date,
        default: Date.now,
      },
    
      resetPasswordToken: String,
      resetPasswordExpire: String,
// Name type, required
// Email type, required, unique, validate
// Password type, required, minLength, select
// Role type, enum, default
// Subscription id, status
// Avatar public_id, url
// Playlist [ courseId,poster ]
// CreatedAt type, default
// ResetPasswordToken type
// ResetPasswordExpire type
})
export const Users= mongoose.model("Users", schema)