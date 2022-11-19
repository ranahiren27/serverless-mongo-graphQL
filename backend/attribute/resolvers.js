import {
  createAttribute,
  deleteAttribute,
  getAttribute,
  updateAttribute,
} from "./db.js";

const resolvers = {
  Query: {
    attributes: () => getAttribute(),
    attribute: (_, args) => getAttribute(args),
  },
  Mutation: {
    addAttribite: (_, args) => createAttribute(args.input),
    updateAttribute: (_, args) => {
      console.log(args);
      return updateAttribute({ _id: args.input.id, ...args.input });
    },
    deleteAttribute: (_, args) => deleteAttribute(args),
  },
};

export default resolvers;
