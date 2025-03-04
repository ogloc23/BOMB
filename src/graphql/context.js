import jwt from "jsonwebtoken";
import User from "./models/User.js"; // Adjust based on your structure

const context = async ({ req }) => {
  const token = req.headers.authorization || "";

  if (!token) return { user: null };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return { user: null };

    return {
      user,
      isAdmin: decoded.role === "ADMIN", // Extract role from token
    };
  } catch (error) {
    return { user: null };
  }
};

export default context;
