import mongoose from "mongoose";

const conversionSchema = new mongoose.Schema({
    category: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    fromUnit: { type: String, required: true },
    toUnit: { type: String, required: true },
    formula: { type: String, required: true },
    parameter: { type: String, required: true }
});

export const Units = mongoose.model("Units", conversionSchema, "Units");
