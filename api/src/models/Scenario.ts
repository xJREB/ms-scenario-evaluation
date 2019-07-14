import * as mongoose from "mongoose";

const scenarioSchema = new mongoose.Schema(
    {
        category: String,
        changes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Change" }],
        description: String,
        hardestChange: { type: mongoose.Schema.Types.ObjectId, ref: "Change" },
        name: String,
        scenarioEffortCosmic: Number,
        scenarioEffortHours: Number,
        scenarioEffortOrdinal: Number,
        scenarioEffortStoryPoints: Number,
        scenarioMaintenanceEffort: Number,
        system: { type: mongoose.Schema.Types.ObjectId, ref: "System" },
        tags: [String]
    },
    { collection: "scenarios" }
);
export default mongoose.model("Scenario", scenarioSchema);
