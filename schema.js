const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

// Hardcoded Data - For Demo Purposes
const customers = [
  { id: '1', name: 'John Doe', email: 'jdoe@gmail.com', age: 35 },
  { id: '2', name: 'Steve Smith', email: 'steve@gmail.com', age: 25 },
  { id: '3', name: 'Sara Williams', email: 'sara@gmail.com', age: 32 }
]

// Customer Type
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
});

// Root Query - A Required Base Query
const RootQuery = new GraphQLObjectType({
  // All ObjectTypes need a "name"
  name: 'RootQueryType',
  fields: {
    // Query Single "customer"
    customer: {
      // ObjectType for RootQuery
      type: CustomerType,
      args: {
        // Param to fetch by
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        // Iterate through "customers" Obj Array
        for(let i = 0; i < customers.length; i++) {
          // Search for customer that matches passed "id"
          if(customers[i].id == args.id) {
            return customers[i];
          }
        }
      }
    },
    // Query All "customers"
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return customers;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
