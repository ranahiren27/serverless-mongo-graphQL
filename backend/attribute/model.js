import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        enum: ["T", "O"],
        require: true
    },
    placeholder: {
        type: String,
    },
    options: {
        type: [String]
    }
});

const AttributeModel = mongoose.model("attributes", attributeSchema);

export default AttributeModel;