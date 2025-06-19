import { ApolloClient, InMemoryCache, HttpLink, createHttpLink } from '@apollo/client';

// ✅ HTTP link (for queries & mutations)
const httpLink = new HttpLink({
    uri:
      process.env.NODE_ENV === 'development'
      // window.location.protocol === 'http:'
        ? 'http://localhost:7334/graphql'
        : `${window.location.origin}/graphql`,
    credentials: 'include',
});
  
const client = new ApolloClient({
    link: createHttpLink({
        uri: 'http://localhost:7334/graphql', // ✅ correct
        credentials: 'include', // ✅ This ensures cookies are sent
    }), // change this to match your deployment
   
    cache: new InMemoryCache({
        typePolicies: {
          User: {
            keyFields: ['_id'], // Must match what’s used in your backend
          },
        },
      }),
});

export default client;
