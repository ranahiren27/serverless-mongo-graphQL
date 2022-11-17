import AttributeType from "./schema.js";
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } from 'graphql';
import { createAttribute, deleteAttribute, getAttribute, updateAttribute } from "./db.js";

export let attributes = [
    { id: 1, name: "color", type: "O", options: ["red", "blue", "black", "white"] },
    { id: 2, name: "size", type: "T", placeholder: "Enter size of product" },
    { id: 3, name: "metirial", type: "O", options: ["wood", "steel"] },
    { id: 4, name: "price", type: "T", placeholder: "Enter price of product" },
]

export const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        attribute: {
            type: AttributeType,
            deprecation: "A single attribute",
            args: {
                _id: {
                    type: GraphQLString
                }
            },
            resolve: (_, args) => getAttribute(args._id)
        },
        attributes: {
            type: new GraphQLList(AttributeType),
            description: "List of All attributes",
            resolve: () => getAttribute()
        },
    })
})

export const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        deleteAttribute: {
            type: AttributeType,
            description: "Delete an attribute",
            args: {
                id: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (_, args) => deleteAttribute(args)
        },
        updateAttribute: {
            type: AttributeType,
            description: "Update an attribute",
            args: {
                id: { type: GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLNonNull(GraphQLString) },
                type: { type: GraphQLNonNull(GraphQLString) },
                placeholder: { type: GraphQLString },
                options: { type: GraphQLList(GraphQLNonNull(GraphQLString)) }
            },
            resolve: (_, args) => updateAttribute(args)
        },
        addAttribite: {
            type: AttributeType,
            description: "Add an attribute",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                type: { type: GraphQLNonNull(GraphQLString) },
                placeholder: { type: GraphQLString },
                options: { type: GraphQLList(GraphQLNonNull(GraphQLString)) }
            },
            resolve: (_, args) => createAttribute({ _id: args.id, ...args })
        }
    })
})
