export const typeDefs = `#graphql
    type User {
        id: ID!
        email:String!
        name: String!
        password: String!
        isManager: String!
        salt: String
    }
`;
