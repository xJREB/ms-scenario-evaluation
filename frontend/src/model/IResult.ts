import IService from "./IService";

export default interface IResult {
    servicesAffected: number;
    criticalService: IService;
    ordinalEffort: number;
    effortStoryPoints: number;
    effortCosmic: number;
    linesOfCodeEffort: number;
    effortHours: number;
    categories: string[];
    servicesNumber: number;
    servicesAffectedTotalServices: any[];
}
