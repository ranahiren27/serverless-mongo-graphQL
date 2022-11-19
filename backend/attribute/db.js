import AttributeModel from "./model.js";

export const createAttribute = async (args) => {
  try {
    console.log(args);
    return await AttributeModel.create(args);
  } catch (error) {
    console.log(error);
    return "Error while adding data!";
  }
};

export const getAttribute = async (args = null) => {
  try {
    let attribute;
    if (args !== null)
      [attribute] = await AttributeModel.find({ _id: args.id });
    else attribute = await AttributeModel.find();
    return attribute;
  } catch (error) {
    console.log(error);
    return "Error while geting data!";
  }
};

export const updateAttribute = async (args) => {
  try {
    await AttributeModel.findByIdAndUpdate(args.id, args);
    const [attribute] = await AttributeModel.find({ _id: args.id });
    return attribute;
  } catch (error) {
    console.log(error);
    return "Error while updating data!";
  }
};

export const deleteAttribute = async (args) => {
  try {
    return await AttributeModel.findByIdAndDelete(args.id);
  } catch (error) {
    console.log(error);
    return "Error while deleting data!";
  }
};
