import User from "../../models/User.js"; // Import the User model

export const balanceResolvers = {
  Mutation: {
    updateUserBalance: async (_, { userId, amount, action }, { user }) => {
      if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }

      const targetUser = await User.findById(userId);
      if (!targetUser) throw new Error("User not found");

      if (action === "increase") {
        targetUser.balance += amount;
      } else if (action === "decrease") {
        if (targetUser.balance < amount) {
          throw new Error("Insufficient balance");
        }
        targetUser.balance -= amount;
      } else {
        throw new Error("Invalid action. Use 'increase' or 'decrease'.");
      }

      await targetUser.save();
      return targetUser;
    },

    updateUserDeposit: async (_, { userId, amount }, { user }) => {
      if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }

      const targetUser = await User.findById(userId);
      if (!targetUser) throw new Error("User not found");

      targetUser.deposit += amount;
      await targetUser.save();
      return targetUser;
    },

    updateUserEarning: async (_, { userId, amount }, { user }) => {
      if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }

      const targetUser = await User.findById(userId);
      if (!targetUser) throw new Error("User not found");

      targetUser.earning += amount;
      await targetUser.save();
      return targetUser;
    },
  }
};
