// A RestClient to interact with Scenario API resources
import axios from "axios";
import { config } from "../config";

export abstract class EvaluationRestClient {
    public static async getEvaluationSystem(id: string): Promise<any> {
        return await axios.get(`${this.api}/systems/${id}/evaluation`);
    }

    private static api = config.apiEndpoint;
}
