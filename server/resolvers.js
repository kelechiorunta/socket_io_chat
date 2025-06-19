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
    },
    Mutation: {
        // markMessagesAsRead: async (_, { senderId }, context) => {
        //   const recipientId = context?.user?._id;
        //   if (!recipientId) throw new Error('Not authenticated');
      
        //   try {
        //     const unreadEntry = await UnreadMsg.findOne({ recipient: recipientId, sender: senderId });
      
        //     if (!unreadEntry) return true;
      
        //     // Remove the unread reference from user
        //     await User.updateOne(
        //       { _id: recipientId },
        //       { $pull: { unread: unreadEntry._id }, $set: { lastMessageCount: 0 } }
        //     );
      
        //     // Delete the unread entry
        //     await UnreadMsg.deleteOne({ _id: unreadEntry._id });
      
        //     return true;
        //   } catch (err) {
        //     console.error('Error marking messages as read:', err);
        //     return false;
        //   }
        // }
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