import IScenario from "./IScenario";
import IService from "./IService";

interface IChange {
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

export default IChange;
