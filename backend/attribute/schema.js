const typeDefs = `
type AttributeType {
  id: String!
  name: String!
  type: String!
  placeholder: String
  options: [String!]
}

input AttributeAddInput {
  name: String!
  type: String!
  placeholder: String
  options: [String!]
}

input AttributeUpdateInput{
  id: String!
  name: String!
  type: String!
  placeholder: String
  options: [String!]
}

type Query {
  attributes: [AttributeType]
  attribute(id: String!): AttributeType
}
type Mutation {
  addAttribite(input: AttributeAddInput): AttributeType
  updateAttribute(input: AttributeUpdateInput!): AttributeType
  deleteAttribute(id: String!): AttributeType
}`;

export default typeDefs;