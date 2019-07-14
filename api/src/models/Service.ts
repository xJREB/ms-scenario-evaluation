import * as mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
        associations: [String],
        description: String,
        name: String,
        system: { type: mongoose.Schema.Types.ObjectId, ref: "System" }
    },
    { collection: "services" }
);

export default mongoose.model("Service", serviceSchema);
