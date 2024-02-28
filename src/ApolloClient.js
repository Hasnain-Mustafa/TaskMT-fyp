import { ApolloClient, ApolloLink,InMemoryCache, ApolloProvider, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';
import { useAuth } from './contexts/AuthContext';

// const httpLink = new HttpLink({ uri: 'http://localhost:3000/graphql' });

// const authLink = new ApolloLink((operation, forward) => {
//   // Retrieve the authorization token from local storage.
//   const token = localStorage.getItem('token');
//   console.log('Token:', token); // Log the token here
//   // Use the setContext method to set the HTTP headers.
//   operation.setContext({
//     headers: {
//       authorization: token ? `${token}` : ''
//     }
//   });

//   // Call the next link in the middleware chain.
//   return forward(operation);
// });

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
  headers:{
    authorization: localStorage.getItem('token') ||''
  }
});
export default client;