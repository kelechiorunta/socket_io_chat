// import UnreadMsg from "./model/UnreadMsg.js";
// import User from "./model/User.js"

// const formatUnreadCounts = (unreadMap) => {
//     if (!(unreadMap instanceof Map)) return [];

//     return Array.from(unreadMap.entries()).map(([senderId, data]) => ({
//       senderId,
//       data,
//     }));
//   };

// const resolvers = {
//     Query: {
//         // users: async (parent, args, context) => {
//         //   if (context?.user) {
//         //     try {
//         //       const users = await User.find({ _id: { $ne: context.user._id } }).populate({
//         //         path: 'unread',
//         //         populate: [
//         //           {
//         //             path: 'sender',
//         //             select: '_id username picture',
//         //           },
//         //           {
//         //             path: 'unreadMsgs',
//         //             select: '_id content createdAt',
//         //           },
//         //         ],
//         //       });

//         //       return users;
//         //     } catch (error) {
//         //       console.error(error);
//         //       throw new Error('Failed to fetch users');
//         //     }
//         //   }
//         // },

//         // auth: async (parent, args, context) => {
//         //   if (context?.user) {
//         //     // Also populate unread for auth query if needed
//         //     const user = await User.findById(context.user._id).populate({
//         //       path: 'unread',
//         //       populate: [
//         //         {
//         //           path: 'sender',
//         //           select: '_id username picture',
//         //         },
//         //         {
//         //           path: 'unreadMsgs',
//         //           select: '_id content createdAt',
//         //         },
//         //       ],
//         //     });

//         //     return user;
//         //   }
//         //   return null;
//         // },
//         users: async (parent, args, context) => {
//             if (!context?.user) return [];

//             try {
//               const users = await User.find({ _id: { $ne: context.user._id } });

//               const enhancedUsers = users.map(user => {
//                 const userObj = user.toObject();
//                 userObj.unreadCounts = formatUnreadCounts(user.unreadCounts);
//                 return userObj;
//               });

//               return enhancedUsers;
//             } catch (error) {
//               console.error(error);
//               throw new Error('Failed to fetch users');
//             }
//           },

//           auth: async (parent, args, context) => {
//             if (!context?.user) return null;

//             const user = await User.findById(context.user._id);
//             const userObj = user.toObject();
//             userObj.unreadCounts = formatUnreadCounts(user.unreadCounts);

//             return userObj;
//           },

//           getUnread: async (_, { senderId, recipientId }) => {
//             try {
//               const user = await User.findById(recipientId);
//               if (!user) throw new Error("Recipient not found");

//               if (!user.unreadCounts) {
//                 user.unreadCounts = new Map();
//               }

//               // Get existing or initialize with defaults
//               let existingData = user.unreadCounts.get(senderId);

//               if (
//                 !existingData ||
//                 typeof existingData !== "object" ||
//                 existingData.count === undefined
//               ) {
//                 existingData = {
//                   count: 0,
//                   lastMessage: "",
//                 };
//               }

//               // Set the valid structure
//               user.unreadCounts.set(senderId, existingData);
//               user.markModified("unreadCounts");
//               await user.save();

//               return user.unreadCounts.get(senderId);
//             } catch (err) {
//               console.error("❌ getUnread error:", err);
//               throw new Error("Failed to get unread count");
//             }
//           },

//     },

//     Mutation: {
//         createUnread: async (_, { senderId, recipientId, newMessage }) => {
//             try {
//               const user = await User.findById(recipientId);
//               if (!user) throw new Error('Recipient not found');

//               const currentCount = user.unreadCounts?.get(senderId) || 0;
//               const currentMsg = user.unreadCounts?.get(newMessage) || 'No Messages';
//               user.unreadCounts.set(senderId, currentCount + 1);
//               user.unreadCounts.set(newMessage, currentMsg);
//               await user.save();

//               return user.unreadCounts.get(senderId);
//             } catch (err) {
//               console.error('❌ createUnread error:', err);
//               throw new Error('Failed to update unread count');
//             }
//           },

//           clearUnread: async (_, { senderId, recipientId }) => {
//             try {
//               const user = await User.findById(recipientId);
//               if (!user) throw new Error('Recipient not found');

//               const existingData = user.unreadCounts?.get(senderId) || { count: 0, lastMessage: '' };

//               user.unreadCounts.set(senderId, {
//                 count: 0,
//                 lastMessage: existingData.lastMessage || '',
//               });

//               await user.save();

//               return true;
//             } catch (err) {
//               console.error('❌ clearUnread error:', err);
//               return false;
//             }
//           },

//         markMessagesAsRead: async (_, { senderId }, { user }) => {
//             if (!user) throw new Error("Unauthorized");

//             const sender = await User.findById(senderId)
//             const recipient = await User.findById(user._id)

//             await UnreadMsg.deleteMany({ recipient, sender });

//             return true;
//           }
//       }

// }

// export default resolvers

import UnreadMsg from './model/UnreadMsg.js';
import User from './model/User.js';

const formatUnreadCounts = (unreadMap) => {
  if (!(unreadMap instanceof Map)) return [];

  return Array.from(unreadMap.entries()).map(([senderId, data]) => ({
    senderId,
    data
  }));
};

const resolvers = {
  Query: {
    users: async (_, args, context) => {
      if (!context?.user) return [];

      try {
        const users = await User.find({ _id: { $ne: context.user._id } });

        const enhancedUsers = users.map((user) => {
          const userObj = user.toObject();
          userObj.unreadCounts = formatUnreadCounts(user.unreadCounts);
          return userObj;
        });

        return enhancedUsers;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch users');
      }
    },

    auth: async (_, args, context) => {
      if (!context?.user) return null;

      const user = await User.findById(context.user._id);
      const userObj = user.toObject();
      userObj.unreadCounts = formatUnreadCounts(user.unreadCounts);

      const io = context.ioInstance;

      // Example usage: emit to a room
      io.to(user._id.toString()).emit('user:authCheck', { status: 'ok' });
      io.broadcast.emit('LoggingIn', { status: 'ok', loggedInUser: user });

      return userObj;
    },

    getUnread: async (_, { senderId, recipientId }) => {
      try {
        // Validate recipient
        const recipient = await User.findById(recipientId);
        if (!recipient) throw new Error('Recipient not found');

        // Look for UnreadMsg document between sender and recipient
        const unreadEntry = await UnreadMsg.findOne({
          sender: senderId,
          recipient: recipientId
        });

        // Return UnreadResult format
        return {
          count: unreadEntry?.count || 0,
          lastMessage: unreadEntry?.lastMessage || ''
        };
      } catch (err) {
        console.error('❌ getUnread error:', err);
        throw new Error('Failed to get unread count');
      }
    }
  },

  Mutation: {
    updateProfile: async (_, { input }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      try {
        if (input.email) {
          const existingEmailUser = await User.findOne({ email: input.email });

          // // If the email exists and doesn't belong to the current user, block it
          // if (existingEmailUser && existingEmailUser._id.toString() !== user._id.toString()) {
          //   throw new Error("Email is already taken by another user");
          // }
          if (existingEmailUser) {
            const updated = await User.findByIdAndUpdate(existingEmailUser._id, input, {
              new: true,
              runValidators: true
            });

            return {
              success: true,
              message: 'Profile updated successfully',
              user: updated
            };
          }
        }
      } catch (err) {
        return {
          success: false,
          message: err.message || 'Failed to update profile',
          user: null
        };
      }
    },

    createUnread: async (_, { input }) => {
      const { senderId, recipientId, newMessage } = input;
      try {
        // Find existing unread record for this recipient/sender pair
        let unread = await UnreadMsg.findOne({ sender: senderId, recipient: recipientId });
        if (!unread) {
          // Create a new one if it doesn't exist
          unread = new UnreadMsg({
            sender: senderId,
            recipient: recipientId,
            count: 1,
            lastMessage: newMessage
          });
        } else {
          // Update existing one
          unread.count += 1;
          unread.lastMessage = newMessage;
        }
        await unread.save();
        return {
          count: unread.count,
          lastMessage: unread.lastMessage
        };
      } catch (err) {
        console.error('❌ createUnread error:', err);
        throw new Error('Failed to update unread count');
      }
    },

    clearUnread: async (_, { senderId, recipientId }) => {
      try {
        const unread = await UnreadMsg.findOne({ sender: senderId, recipient: recipientId });

        if (!unread) return true; // Nothing to clear

        unread.count = 0;
        await unread.save();

        return true;
      } catch (err) {
        console.error('❌ clearUnread error:', err);
        return false;
      }
    },

    markMessagesAsRead: async (_, { senderId }, context) => {
      const recipientId = context.user?._id;
      if (!recipientId) throw new Error('Unauthorized');

      try {
        await UnreadMsg.deleteMany({
          sender: senderId,
          recipient: recipientId
        });

        return true;
      } catch (err) {
        console.error('❌ markMessagesAsRead error:', err);
        return false;
      }
    }
  }
};

export default resolvers;
