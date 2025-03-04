import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // ✅ Added missing import
import { generateToken } from '../../utils/auth.js';
import { sendEmail } from '../../utils/email.js';

export const userResolvers = {
    Query: {
        getAllUsers: async (_, __, { user }) => {
            if (!user || user.role !== "ADMIN") {
                throw new Error("Unauthorized access");
            }
        
            const users = await User.find().lean();
            return users.map(user => ({
                ...user,
                id: user._id.toString(), // ✅ Ensure _id is returned as id
            }));
        },
        

        getUserProfile: async (_, { id }) => {
            const user = await User.findById(id).lean();
            if (!user) throw new Error('User not found');

            return {
                ...user,
                id: user._id.toString(), // ✅ Convert MongoDB _id to a GraphQL-friendly ID
            };
        },
    },

    Mutation: {
        register: async (_, { firstName, lastName, userName, email, password }) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error("User already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                firstName,
                lastName,
                userName,
                email,
                password: hashedPassword,
                role: "USER", // ✅ Ensure default role
            });

            await user.save();
            return user;  
        },

        registerAdmin : async (_, { firstName, lastName, userName, email, password }, { user }) => {
            // Check if an admin already exists
            const existingAdmins = await User.findOne({ role: "ADMIN" });
        
            if (!existingAdmins && !user) {
                // ✅ First admin can register without authentication
            } else if (!user || user.role !== "ADMIN") {
                throw new Error("Unauthorized to create an admin");
            }
        
            // Check if email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) throw new Error("User already exists");
        
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
        
            // Create new admin
            const newAdmin = await User.create({
                firstName,
                lastName,
                userName,
                email,
                password: hashedPassword,
                role: "ADMIN",
            });
        
            console.log("New Admin Created:", newAdmin); // ✅ Debugging log
        
            // Generate token
            const token = generateToken(newAdmin);
        
            // ✅ Return both token and user (to match AuthPayload)
            return {
                token,
                user: newAdmin,
            };
        },

        
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error("Invalid credentials");

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) throw new Error("Invalid credentials");

            const token = jwt.sign(
                { id: user.id, role: user.role }, // ✅ Payload
                process.env.JWT_SECRET, 
                { expiresIn: "7d" } 
            );

            return { token, user };
        },

        requestPasswordReset: async (_, { email }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error("User not found");

            const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
            await user.save();

            await sendEmail(user.email, "Password Reset Request", `Your password reset code is: ${resetToken}`);

            return { message: "Reset code sent to email" };
        },

        resetPassword: async (_, { token, newPassword }) => {
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) throw new Error("Invalid or expired token");

            user.password = await bcrypt.hash(newPassword, 10);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();

            return { message: "Password reset successful. You can now log in." };
        },
    },
};
