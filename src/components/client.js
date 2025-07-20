import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// // ✅ HTTP link (for queries & mutations)
// const httpLink = new HttpLink({
//     uri:
//       process.env.NODE_ENV === 'development'
//       // window.location.protocol === 'http:'
//         ? 'http://localhost:7334/graphql'
//         : `${window.location.origin}/graphql`,
//     credentials: 'include',
// });
  
// const isDev = process.env.NODE_ENV === 'development';

const client = new ApolloClient({
        link: createHttpLink({
        uri: 'https://socketiochat-production.up.railway.app/graphql',
        credentials: 'include',
    }),
    cache: new InMemoryCache({
        typePolicies: {
          User: {
            keyFields: ['_id'],
          },
        },
    }),
});


export default client;
