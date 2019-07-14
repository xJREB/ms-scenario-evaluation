export interface IChange {
    _id?: string;
    service: IService;
    scenario: IScenario;
    description: string;
    type: string;
    effortHours: number;
    effortOrdinal: number;
    effortCodeNew: number;
    effortCosmicFunctionPoints: number;
    cosmicType: string;
    effortStoryPoints: number;
    ripples: IService[];
}

export interface IScenario {
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

export interface ISystem {
    _id?: string;
    name: string;
    description: string;
    services?: IService[];
    scenarios?: IScenario[];
}

export interface IService {
    _id?: string;
    name: string;
    system: ISystem;
    description: string;
    associations: string[];
}

export interface ISystemEvaluation {
    servicesAffectedTotal: number;
    servicesAffectedTotalServices: any[];
    effortHours: number;
    linesOfCodeEffort: number;
    ordinalEffort: number;
    effortCosmic: number;
    effortStoryPoints: number;
    categories: string[];
    criticalService: IService;
    servicesNumber: number;
    scenarios: IScenario[];
    systemName: string;
    pieChartArrayServicesChangeMost: any[];
    criticalServiceEffortHours: {
        serviceHighestEffort: string;
        serviceHighestEffortNumber: number;
        serviceLowestEffort: string;
        serviceLowestEffortNumber: number;
        servicesEffortArray: any[];
    };
    criticalServiceEffortOrdinal: {
        serviceHighestEffort: string;
        serviceHighestEffortNumber: number;
        serviceLowestEffort: string;
        serviceLowestEffortNumber: number;
        servicesEffortArray: any[];
    };
    criticalServiceEffortCosmic: {
        serviceHighestEffort: string;
        serviceHighestEffortNumber: number;
        serviceLowestEffort: string;
        serviceLowestEffortNumber: number;
        servicesEffortArray: any[];
    };
    criticalServiceEffortStory: {
        serviceHighestEffort: string;
        serviceHighestEffortNumber: number;
        serviceLowestEffort: string;
        serviceLowestEffortNumber: number;
        servicesEffortArray: any[];
    };
    advancedScenariosHours: IAdvancedScenarios[];
    advancedScenariosOrdinal: IAdvancedScenarios[];
    advancedScenariosCosmic: IAdvancedScenarios[];
    advancedScenariosStory: IAdvancedScenarios[];
}

export interface IAdvancedScenarios {
    name: string;
    changesLength: number;
    scenarioEffort: number;
    affectedServices: number;
    category: string;
    changeHighestEffort: string;
    changeLowestEffort: string;
    changesMostRipples: string;
    tags: string[];
}
