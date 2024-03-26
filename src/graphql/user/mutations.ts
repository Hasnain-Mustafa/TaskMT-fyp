export const mutations = `#graphql
    signUpUser(email:String, name:String, password:String, isManager: Boolean, salt: String) :String
    generateUserToken(email:String!, password:String!):String
    `;
