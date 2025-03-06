import mongoose from 'mongoose';

// User Schema definition
const UserSchema = new mongoose.Schema({
  firstName: {  // ✅ Now at the top and required
    type: String,
    required: true,
  },
  lastName: {  // ✅ Now at the top and required
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  balance: { 
    type: Number, 
    default: 0 
  },
  deposit: { 
    type: Number, 
    default: 0 
  },
  earning: { 
    type: Number, 
    default: 0 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', UserSchema);

export default User;
