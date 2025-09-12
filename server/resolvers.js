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

import Chat from './model/Chat.js';
import ChatMessage from './model/ChatMessage.js';
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

      // if (context.ioInstance && context.user) {
      //   context.ioInstance.emit('LoggingIn', {
      //     status: 'ok',
      //     loggedInUser: context.user
      //   });
      //   console.log('loggingin');
      // }

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
      // // Example usage: emit to a room
      // io.to(user._id.toString()).emit('user:authCheck', { status: 'ok' });
      // io.broadcast.emit('LoggingIn', { status: 'ok', loggedInUser: user });

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
          lastMessage: unreadEntry?.lastMessage || '',
          updatedAt: unreadEntry?.updatedAt || '',
          createdAt: unreadEntry?.createdAt || ''
        };
      } catch (err) {
        console.error('❌ getUnread error:', err);
        throw new Error('Failed to get unread count');
      }
    },
    messages: async (_, { chatId }, context) => {
      try {
        if (!context?.user) throw new Error('Unauthorized');

        const msgs = await ChatMessage.find({ chat: chatId })
          .populate('sender')
          .populate('receiver')
          .sort({ createdAt: 1 });

        // ✅ attach imageUrl dynamically here
        return msgs.map((m) => ({
          ...m.toObject(),
          imageUrl: m.imageFileId
            ? `https://socketiochat-production.up.railway.app/chat-pictures/${m.imageFileId.toString()}?t=${Date.now()}`
            : null
        }));
      } catch (err) {
        console.error('❌ messages resolver error:', err);
        throw new Error('Failed to fetch messages');
      }
    },
    fetch_chats: async (_, { userId, currentUserId }) => {
      try {
        // ✅ Fetch sender and receiver messages with lean (plain JS objects, much faster)
        const messages = await ChatMessage.find({
          $or: [
            { sender: userId, receiver: currentUserId },
            { sender: currentUserId, receiver: userId }
          ]
        })
          .sort({ createdAt: 1 }) // oldest → newest
          .populate('sender', '_id username picture')
          .populate('receiver', '_id username picture')
          .lean(); // ⚡ returns plain JS objects instead of full mongoose docs

        // ✅ Optionally fetch "notifiedUser" with lean
        const notifiedUser = await User.findById(userId).lean();

        // ✅ Transform messages to include image/placeholder URLs
        const enhancedMessages = messages.map((msg) => ({
          ...msg,
          imageUrl: msg.imageFileId
            ? `https://socketiochat-production.up.railway.app/chat-pictures/${msg.imageFileId.toString()}?t=${Date.now()}`
            : null,
          placeholderUrl: msg.placeholderImgId
            ? `https://socketiochat-production.up.railway.app/chat-pictures/${msg.placeholderImgId.toString()}?t=${Date.now()}`
            : null
        }));

        return {
          messages: enhancedMessages,
          notifiedUser
        };
      } catch (err) {
        console.error('❌ fetch_chats error:', err);
        throw new Error('Failed to fetch chat history');
      }
    }
    // fetch_chats: async (_, { userId, currentUserId }) => {
    //   try {
    //     // ✅ Fetch sender and receiver messages
    //     const messages = await ChatMessage.find({
    //       $or: [
    //         { sender: userId, receiver: currentUserId },
    //         { sender: currentUserId, receiver: userId }
    //       ]
    //     })
    //       .sort({ createdAt: 1 }) // oldest → newest
    //       .populate('sender', '_id username picture')
    //       .populate('receiver', '_id username picture');

    //     // ✅ Optionally fetch "notifiedUser"
    //     const notifiedUser = await User.findById(userId);

    //     // ✅ Transform messages to include imageUrl from GridFS
    //     const enhancedMessages = messages.map((msg) => ({
    //       ...msg.toObject(),
    //       imageUrl: msg.imageFileId
    //         ? `https://socketiochat-production.up.railway.app/chat-pictures/${msg.imageFileId.toString()}?t=${Date.now()}`
    //         : null,
    //       placeholderUrl: msg.placeholderImgId
    //         ? `https://socketiochat-production.up.railway.app/chat-pictures/${msg.placeholderImgId.toString()}?t=${Date.now()}`
    //         : null
    //     }));

    //     return {
    //       messages: enhancedMessages,
    //       notifiedUser
    //     };
    //   } catch (err) {
    //     console.error('❌ fetch_chats error:', err);
    //     throw new Error('Failed to fetch chat history');
    //   }
    // }
  },

  Mutation: {
    deleteMessage: async (_, { messageId, senderId }, { ioInstance }) => {
      try {
        // ✅ Find the message by ID
        const message = await ChatMessage.findById(messageId);
        if (!message) {
          throw new Error('Message not found');
        }

        // ✅ Ensure only the sender can delete their own message
        if (message.sender.toString() !== senderId) {
          throw new Error('Not authorized to delete this message');
        }

        // ✅ Remove message reference from Chat
        await Chat.findByIdAndUpdate(message.chat, {
          $pull: { messages: message._id }
        });

        // ✅ Delete the actual message
        await message.deleteOne();

        if (ioInstance) {
          ioInstance.emit('messageDeleted', { messageId: message._id });
        }

        return {
          success: true,
          messageId
        };
      } catch (error) {
        console.error('❌ deleteMessage error:', error);
        return {
          success: false,
          messageId: null,
          error: error.message
        };
      }
    },
    updateProfile: async (_, { input }, { user, ioInstance }) => {
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

            if (ioInstance && existingEmailUser) {
              ioInstance.emit('Updating', { updatedUser: updated });
            }
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
