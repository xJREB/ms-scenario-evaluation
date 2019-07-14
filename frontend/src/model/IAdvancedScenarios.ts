interface IAdvancedScenarios {
    name: string;
    changesLength: number;
    scenarioEffort: number;
    scenarioEffortHours: number;
    affectedServices: number;
    category: string;
    changeHighestEffort: string;
    changeLowestEffort: string;
    changesMostRipples: string;
    tags: string[];
}

export default IAdvancedScenarios;
