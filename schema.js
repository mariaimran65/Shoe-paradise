const graphql = require("graphql");
const Users = require("./db/users");
const User = require("./db/users");
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = graphql;

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLInt },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "rootquery",
  fields: {
    firstgraph: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        console.log(args);
        let data = new User();
        return data;
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery });
