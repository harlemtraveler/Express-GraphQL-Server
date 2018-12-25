const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');

// Hardcoded Data - For Demo Purposes
// const customers = [
//   { id: '1', name: 'John Doe', email: 'jdoe@gmail.com', age: 35 },
//   { id: '2', name: 'Steve Smith', email: 'steve@gmail.com', age: 25 },
//   { id: '3', name: 'Sara Williams', email: 'sara@gmail.com', age: 32 }
// ]

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
        return axios.get('http://localhost:3000/customers/' + args.id)
          // the promise returns an DataObject
          .then(res => res.data);
      }
    },
    // Query All "customers"
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        return axios.get('http://localhost:3000/customers')
          .then(res => res.data);
      }
    }
  }
});

// Mutations - Enables full CRUD (Write functionality)
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        // "GraphQLNonNull" is used to make field required
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, args) {
        return axios.post('http://localhost:3000/customers', {
          name: args.name,
          email: args.email,
          age: args.age
        })
        .then(res => res.data);
      }
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, args) {
        return axios.delete('http://localhost:3000/customers/' + args.id)
          .then(res => res.data);
      }
    },
    editCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        return axios.patch('http://localhost:3000/customers/' + args.id, args)
        .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
