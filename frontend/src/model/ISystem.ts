import IScenario from "./IScenario";
import IService from "./IService";

interface ISystem {
    _id?: string;
    name: string;
    description: string;
    services?: IService[];
    scenarios?: IScenario[];
}

export default ISystem;
