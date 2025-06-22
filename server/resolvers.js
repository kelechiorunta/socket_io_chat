import UnreadMsg from "./model/UnreadMsg.js";
import User from "./model/User.js"

const resolvers = {
    Query: {
        users: async (parent, args, context) => {
          if (context?.user) {
            try {
              const users = await User.find({ _id: { $ne: context.user._id } }).populate({
                path: 'unread',
                populate: [
                  {
                    path: 'sender',
                    select: '_id username picture',
                  },
                  {
                    path: 'unreadMsgs',
                    select: '_id content createdAt',
                  },
                ],
              });
      
              return users;
            } catch (error) {
              console.error(error);
              throw new Error('Failed to fetch users');
            }
          }
        },
      
        auth: async (parent, args, context) => {
          if (context?.user) {
            // Also populate unread for auth query if needed
            const user = await User.findById(context.user._id).populate({
              path: 'unread',
              populate: [
                {
                  path: 'sender',
                  select: '_id username picture',
                },
                {
                  path: 'unreadMsgs',
                  select: '_id content createdAt',
                },
              ],
            });
      
            return user;
          }
          return null;
        },

        getUnread: async (_, { senderId, recipientId }) => {
            try {
              const user = await User.findById(recipientId);
              if (!user) throw new Error('Recipient not found');
      
              const currentCount = user.unreadCounts?.get(senderId) || 0;
              user.unreadCounts.set(senderId, currentCount);
              await user.save();
      
              return user.unreadCounts.get(senderId);
            } catch (err) {
              console.error('❌ createUnread error:', err);
              throw new Error('Failed to update unread count');
            }
          },
    },

    Mutation: {
        createUnread: async (_, { senderId, recipientId }) => {
            try {
              const user = await User.findById(recipientId);
              if (!user) throw new Error('Recipient not found');
      
              const currentCount = user.unreadCounts?.get(senderId) || 0;
              user.unreadCounts.set(senderId, currentCount + 1);
              await user.save();
      
              return user.unreadCounts.get(senderId);
            } catch (err) {
              console.error('❌ createUnread error:', err);
              throw new Error('Failed to update unread count');
            }
          },
      
          clearUnread: async (_, { senderId, recipientId }) => {
            try {
              const user = await User.findById(recipientId);
              if (!user) throw new Error('Recipient not found');
      
              user.unreadCounts.set(senderId, 0);
              await user.save();
      
              return true;
            } catch (err) {
              console.error('❌ clearUnread error:', err);
              return false;
            }
        },
          
        markMessagesAsRead: async (_, { senderId }, { user }) => {
            if (!user) throw new Error("Unauthorized");

            const sender = await User.findById(senderId)
            const recipient = await User.findById(user._id)
          
            await UnreadMsg.deleteMany({ recipient, sender });
          
            return true;
          }
      }
      
      
}

export default resolvers