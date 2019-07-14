import ISystem from "./ISystem";

interface IService {
    _id?: string;
    name: string;
    system: ISystem;
    description: string;
    associations: string[];
}

export default IService;
