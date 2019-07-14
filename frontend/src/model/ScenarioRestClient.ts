// A RestClient to interact with Scenario API resources
import axios from "axios";
import { config } from "../config";
import IChange from "./IChange";
import IScenario from "./IScenario";

export abstract class ScenarioRestClient {
    // Get all scenarios, potentially of a single system
    public static async getScenarios(id?: string): Promise<IScenario[]> {
        const query = id ? `?systemId=${id}` : "";
        return (await axios.get(`${this.api}/scenarios${query}`)).data;
    }

    // Get scenario by id
    public static async getScenario(id?: string): Promise<IScenario> {
        return (await axios.get(`${this.api}/scenario/${id}`)).data;
    }

    // Create scenario
    public static createScenario(
        scenario: IScenario,
        changes: IChange[]
    ): Promise<any> {
        return axios.post(`${this.api}/scenarios`, { scenario, changes });
    }

    // Update scenario
    public static updateScenario(
        id: string,
        scenario: IScenario,
        changes: IChange[]
    ): Promise<any> {
        return axios.put(`${this.api}/scenarios/${id}`, { scenario, changes });
    }

    // Delete scenario
    public static deleteScenario(id: string): Promise<any> {
        return axios.delete(`${this.api}/scenarios/${id}`);
    }

    // Get all changes, potentially of a single scenario
    public static async getChanges(id?: string): Promise<IChange[]> {
        const query = id ? `?scenarioId=${id}` : "";
        return (await axios.get(`${this.api}/changes${query}`)).data;
    }

    // Delete change
    public static deleteChange(id: string): Promise<any> {
        return axios.delete(`${this.api}/changes/${id}`);
    }

    // reset changes
    // in the webapp a user can manipulate the changes during the editing process of a scenario. This means he can
    // add new services, which will be created in the database. Also new added services could be possibly deleted.
    // If a user decides to reload the page or navigate to another route, then the manipulation needs to be reset
    // in the database
    public static resetChanges(
        actualChanges: IChange[],
        oldChanges: IChange[],
        systemID,
        scenarioID
    ): Promise<any> {
        return axios.post(`${this.api}/changes/reset`, {
            actualChanges,
            oldChanges,
            systemID,
            scenarioID
        });
    }

    private static api = config.apiEndpoint;
}
