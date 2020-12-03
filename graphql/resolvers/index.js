const { mergeResolvers } = require("@graphql-tools/merge");

const usersResolvers = require("./usersResolver");

const resolvers = [usersResolvers];

module.exports = mergeResolvers(resolvers);
