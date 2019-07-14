import * as mongoose from "mongoose";

const changeSchema = new mongoose.Schema(
    {
        cosmicType: String,
        description: String,
        effortCodeNew: Number,
        effortCosmicFunctionPoints: Number,
        effortHours: Number,
        effortOrdinal: Number,
        effortStoryPoints: Number,
        ripples: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
        scenario: { type: mongoose.Schema.Types.ObjectId, ref: "Scenario" },
        service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
        type: String
    },
    { collection: "changes" }
);

export default mongoose.model("Change", changeSchema);
