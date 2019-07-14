import * as mongoose from "mongoose";

const systemSchema = new mongoose.Schema(
    {
        description: String,
        name: String,
        scenarios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scenario" }],
        services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }]
    },
    { collection: "systems" }
);

export default mongoose.model("System", systemSchema);
