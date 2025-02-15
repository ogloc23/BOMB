import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/auth.js';
import { sendEmail } from '../utils/email.js';
import generateSlug from '../utils/slug.js';
import crypto from 'crypto';
import mongoose from 'mongoose';

export const resolvers = {
    Query: {
        getAllUsers: async () => {
            const users = await User.find().lean();
            return users.map(user => ({
                ...user,
                id: user._id.toString(), // Ensure _id is returned as id
            }));
        },

        getUserProfile: async (_, { id }) => {
            const user = await User.findById(id).lean();
            if (!user) throw new Error('User not found');

            return {
                ...user,
                id: user._id.toString(), // Convert MongoDB _id to a GraphQL-friendly ID
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
            });

            await user.save();
            return user;  // ✅ Only return the user, no token
        },

        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("Invalid credentials");
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error("Invalid credentials");
            }

            const token = generateToken(user._id);
            return { token, user };  // ✅ Return token on login
        },

        requestPasswordReset: async (_, { email }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("User not found");
            }

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

            if (!user) {
                throw new Error("Invalid or expired token");
            }

            user.password = await bcrypt.hash(newPassword, 10);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();

            return { message: "Password reset successful" };
        },
    },
};
