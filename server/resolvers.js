import User from "./model/User.js"
import fetch from 'node-fetch';

const resolvers = {
    Query: {
        users: async (parent, args, context) => {
            return await User.find()
        },
        auth: async (parent, args, context) => {
        //     try {
        //         const response = await fetch('http://localhost:7334/isAuthenticated', {
        //             credentials: 'include',
        //             method: 'GET',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 Cookie: context.cookie, 
        //             },
        //         });
                
        //         const data = await response.json();
                
        //         if (!response.ok || !data.user) {
        //             throw new Error(data.error || 'Unauthorized');
        //         }
                
        //         return data?.user
        //         } catch (err) {
        //             console.error('Auth check failed:', err);
        //                 // localStorage.removeItem('entry');
        //         }
                    
            return context?.user
        }
    }
}

export default resolvers