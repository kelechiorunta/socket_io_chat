import User from "./model/User.js"

const resolvers = {
    Query: {
        users: async (parent, args, context) => {
            if (context?.user) {
                try {
                    const users = await User.find({ _id: { $ne: context.user._id } });
                    return users;
                  } catch (error) {
                    throw new Error('Failed to fetch users');
                  }
            }   
          },
        auth: async (parent, args, context) => {
                    
            return context?.user
        }
    }
}

export default resolvers