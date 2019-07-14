import IChange from "./IChange";
import ISystem from "./ISystem";

interface IScenario {
    _id?: string;
    name: string;
    system: ISystem;
    description: string;
    scenarioEffortHours: number;
    scenarioMaintenanceEffort: number;
    scenarioEffortOrdinal: number;
    scenarioEffortCosmic: number;
    scenarioEffortStoryPoints: number;
    category: string;
    changes?: IChange[];
    hardestChange?: IChange;
    tags: string[];
}

export default IScenario;
