import IAdvancedScenarios from "./IAdvancedScenarios";
import IScenario from "./IScenario";
import IService from "./IService";

export default interface IEvaluationSystem {
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
    pieChartArrayServicesChangeMost;
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
