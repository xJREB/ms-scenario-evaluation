// A RestClient to interact with System API resources
import axios from "axios";
import { config } from "../config";
import IService from "./IService";
import ISystem from "./ISystem";

export abstract class SystemRestClient {
    // Get all systems
    public static async getSystems(): Promise<ISystem[]> {
        return (await axios.get(`${this.api}/systems`)).data;
    }

    // Get system by id
    public static async getSystemById(id: string): Promise<ISystem> {
        return (await axios.get(`${this.api}/systems/${id}`)).data;
    }

    // Create system
    public static createSystem(
        system: ISystem,
        services: IService[]
    ): Promise<any> {
        return axios.post(`${this.api}/systems`, { system, services });
    }

    // Update system
    public static updateSystem(system: ISystem): Promise<any> {
        return axios.put(`${this.api}/systems/${system._id}`, { system });
    }

    // Delete system
    public static deleteSystem(id: string): Promise<any> {
        return axios.delete(`${this.api}/systems/${id}`);
    }

    // Create service
    public static createService(service: IService): Promise<any> {
        return axios.post(`${this.api}/services`, service);
    }

    // Update service
    public static updateService(id: string, service: IService): Promise<any> {
        return axios.put(`${this.api}/services/${id}`, service);
    }

    // Delete service
    public static deleteService(id: string): Promise<any> {
        return axios.delete(`${this.api}/services/${id}`);
    }

    // Delete services that were created in the scenario as [new addition] when the page reloads or the user move without
    // saving the scenario
    public static deleteServices(serviceIDs: string[]): Promise<any> {
        const params = {
            serviceIDs
        };
        return axios.delete(`${this.api}/services`, { params });
    }

    private static api = config.apiEndpoint;
}
