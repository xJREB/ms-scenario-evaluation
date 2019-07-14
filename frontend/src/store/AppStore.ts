import Vue from "vue";
import Vuex from "vuex";
import IChange from "../model/IChange";
import IChangeAndRipple from "../model/IChangeAndRipple";
import IScenario from "../model/IScenario";
import IService from "../model/IService";
import ISystem from "../model/ISystem";
import { AppState } from "./states/AppState";
import { GeneralState } from "./states/GeneralState";
import { ScenarioState } from "./states/ScenarioState";
import { SystemState } from "./states/SystemState";

Vue.use(Vuex);

/**
 * All the namespaces for the modules
 */
export const enum StateModule {
    GENERAL = "GENERAL",
    APP = "APP",
    SYSTEM = "SYSTEM",
    SCENARIO = "SCENARIO"
}

export const AppStore = new Vuex.Store({
    /**
     * Register a new module here
     *
     * MYMODULE : new MyModule().state
     */
    modules: {
        APP: new AppState().state,
        GENERAL: new GeneralState().state,
        SCENARIO: new ScenarioState().state,
        SYSTEM: new SystemState().state
    },

    /**
     * since you can only put primitive variables into the vuex and do get() and set() methods you have to put all
     * other variables into the state attribute
     */
    state: {
        change: {
            cosmicType: "Entry",
            description: "",
            effortCodeNew: 0,
            effortCosmicFunctionPoints: 0,
            effortHours: 0,
            effortOrdinal: 0,
            effortStoryPoints: 1,
            ripples: new Array<IService>(),
            scenario: { _id: "" } as IScenario,
            service: { name: "", _id: "" } as IService,
            type: ""
        } as IChange,
        changes: Array<IChange>(),
        createdServicesScenario: Array<IService>(),
        oldScenario: {
            category: "",
            description: "",
            name: "",
            scenarioEffortCosmic: 0,
            scenarioEffortHours: 0,
            scenarioEffortOrdinal: 0,
            scenarioEffortStoryPoints: 0,
            scenarioMaintenanceEffort: 0,
            tags: []
        } as IScenario,
        scenario: {
            category: "",
            description: "",
            name: "",
            scenarioEffortCosmic: 0,
            scenarioEffortHours: 0,
            scenarioEffortOrdinal: 0,
            scenarioEffortStoryPoints: 0,
            scenarioMaintenanceEffort: 0,
            tags: []
        } as IScenario,
        service: {
            name: "",
            description: "",
            system: { _id: "" } as ISystem,
            associations: []
        } as IService,
        serviceNames: Array<string>(),
        services: Array<IService>(),
        system: { name: "", description: "" } as ISystem,
        systemNames: Array<string>()
    },

    /**
     * if you want to mutate state variables you have to write methods that set the variables
     */
    mutations: {
        resetSystem(state) {
            state.system = { name: "", description: "" } as ISystem;
        },
        resetService(state) {
            state.service = {
                name: "",
                description: "",
                system: { _id: "" } as ISystem,
                associations: []
            } as IService;
        },
        resetScenario(state) {
            state.scenario = {
                category: "",
                description: "",
                name: "",
                scenarioEffortCosmic: 0,
                scenarioEffortHours: 0,
                scenarioEffortOrdinal: 0,
                scenarioEffortStoryPoints: 0,
                scenarioMaintenanceEffort: 0,
                tags: []
            } as IScenario;
            state.oldScenario = {
                category: "",
                description: "",
                name: "",
                scenarioEffortCosmic: 0,
                scenarioEffortHours: 0,
                scenarioEffortOrdinal: 0,
                scenarioEffortStoryPoints: 0,
                scenarioMaintenanceEffort: 0,
                tags: []
            } as IScenario;
        },
        resetChange(state) {
            state.change = {
                cosmicType: "Entry",
                description: "",
                effortCodeNew: 0,
                effortCosmicFunctionPoints: 0,
                effortHours: 0,
                effortOrdinal: 0,
                effortStoryPoints: 1,
                ripples: Array<IService>(),
                scenario: { name: "", _id: "" } as IScenario,
                service: { name: "", _id: "" } as IService,
                type: ""
            } as IChange;
        },
        resetChanges(state) {
            state.changes = Array<IChange>();
        },
        resetSystemNames(state) {
            state.systemNames = Array<string>();
        },
        resetServices(state) {
            state.services = Array<IService>();
        },
        resetCreatedServices(state) {
            state.createdServicesScenario = Array<IService>();
        },
        setSystemName(state, name) {
            state.system.name = name;
        },
        setSystemDescription(state, description) {
            state.system.description = description;
        },
        setSystemID(state, id) {
            state.system._id = id;
        },
        setCompleteSystem(state, system) {
            state.system = system;
        },
        setService(state, service: IService) {
            state.service = {
                _id: service._id,
                associations: service.associations,
                description: service.description,
                name: service.name,
                system: { _id: state.system._id } as ISystem
            };
        },
        setServiceWithoutID(state, service: IService) {
            state.service = service;
        },
        setSingleService(state, obj) {
            state.services[obj.index] = {
                _id: obj.service._id,
                associations: obj.service.associations,
                description: obj.service.description,
                name: obj.service.name,
                system: obj.service.system
            } as IService;
        },
        setServices(state, services) {
            state.services = services;
        },
        addService(state, service) {
            state.services.push(service);
        },
        removeService(state, index) {
            state.services.forEach(service => {
                service.associations.forEach(associate => {
                    if (associate.includes(state.services[index].name)) {
                        service.associations.splice(
                            service.associations.findIndex(
                                associateService =>
                                    associateService === associate
                            ),
                            1
                        );
                    }
                });
            });
            state.services.splice(index, 1);
        },
        setScenarioDetails(state, scenario) {
            state.scenario = scenario;
            state.oldScenario = scenario;
        },
        setScenarioDetailsDetail(state) {
            state.scenario.changes = state.changes;
        },
        setSystems(state, systems) {
            for (let i = 0; i < systems.length; i++) {
                state.systemNames[i] = "";
                state.systemNames[i] = systems[i].name;
            }
        },
        addScenario(state, obj) {
            state.system = obj.system;
            state.scenario.name = obj.scenarioName;
            state.scenario.description = obj.scenarioDescription;
            state.scenario.category = obj.category;
            state.serviceNames = [];
            state.scenario.system = obj.system;
            state.scenario.tags = obj.tags;
            for (let i = 0; i < obj.system.services.length; i++) {
                state.serviceNames[i] = obj.system.services[i].name;
            }
        },
        setServiceNames(state, services) {
            state.serviceNames = [];
            for (let i = 0; i < services.length; i++) {
                state.serviceNames[i] = services[i].name;
            }
        },
        setChange(state, obj) {
            state.change = {
                cosmicType: "Entry",
                description: "",
                effortCodeNew: 0,
                effortCosmicFunctionPoints: 0,
                effortHours: 0,
                effortOrdinal: 0,
                effortStoryPoints: 1,
                ripples: Array<IService>(),
                scenario: { name: "", _id: "" } as IScenario,
                service: { name: "", _id: "" } as IService,
                type: ""
            } as IChange;
            state.change.service = obj.service;
            state.change.scenario.name = obj.scenarioName;
            state.change.description = obj.description;
            state.change.type = obj.type;
            state.change.ripples = obj.ripples;
            state.change.effortHours = Number(obj.effortHours);
            state.change.effortOrdinal = obj.effortOrdinal;
            state.change.effortCosmicFunctionPoints =
                obj.effortCosmicFunctionPoints;
            state.change.cosmicType = obj.cosmicType;
            state.change.effortStoryPoints = obj.effortStoryPoints;
            state.change.effortCodeNew = Number(obj.effortCodeNew);
            // if the code is set, then the hours of person month is calculated according to a weight citet in ALMA
            if (state.change.effortCodeNew !== 0) {
                if (state.change.type === "modification") {
                    state.change.effortHours =
                        Math.round((state.change.effortCodeNew / 1.4) * 100) /
                        100;
                } else {
                    state.change.effortHours =
                        Math.round((state.change.effortCodeNew / 6) * 100) /
                        100;
                }
            }
        },
        addChange(state, change) {
            state.changes.push(change);
        },
        editChange(state, obj) {
            state.changes[obj.index] = obj.change;
        },
        removeChange(state, index) {
            state.changes.splice(index, 1);
        },
        addChangeAdvanced(state, obj: IChangeAndRipple) {
            state.changes.push({
                cosmicType: obj.change.cosmicType,
                description: obj.change.description,
                effortCodeNew: obj.change.effortCodeNew,
                effortCosmicFunctionPoints:
                    obj.change.effortCosmicFunctionPoints,
                effortHours: obj.change.effortHours,
                effortOrdinal: obj.change.effortOrdinal,
                effortStoryPoints: obj.change.effortStoryPoints,
                ripples: obj.ripples,
                scenario: { _id: "" } as IScenario,
                service: obj.change.service,
                type: obj.change.type
            } as IChange);
            state.changes[state.changes.length - 1].ripples = obj.ripples;
        },
        setScenarioEffort(state) {
            let effortOrdinal: number = 0;
            let effortHours: number = 0;
            let effortNewCode: number = 0;
            let effortCosmic: number = 0;
            let effortStoryPoints: number = 0;
            state.changes.forEach(change => {
                effortHours += Number(change.effortHours);
                effortOrdinal += Number(change.effortOrdinal);
                effortNewCode += Number(change.effortCodeNew);
                effortCosmic += Number(change.effortCosmicFunctionPoints);
                effortStoryPoints += Number(change.effortStoryPoints);
            });
            state.scenario.scenarioEffortOrdinal =
                Math.round(effortOrdinal * 100) / 100;
            state.scenario.scenarioMaintenanceEffort = effortNewCode;
            state.scenario.scenarioMaintenanceEffort = Math.round(
                state.scenario.scenarioMaintenanceEffort
            );
            state.scenario.scenarioEffortHours = effortHours;
            state.scenario.scenarioEffortCosmic = effortCosmic;
            state.scenario.scenarioEffortStoryPoints = effortStoryPoints;

            delete state.scenario.changes;
        },
        removeServiceFromChange(state, service: IService) {
            let index = state.serviceNames.findIndex(
                name => name === service.name
            );
            state.serviceNames.splice(index, 1);
            // first remove all changes and ripples with the deleted service
            for (let i = 0; i < state.changes.length; i++) {
                index = state.changes[i].ripples.findIndex(
                    ripple => ripple.name === service.name
                );
                if (index !== -1) {
                    state.changes[i].ripples.splice(index, 1);
                }
                if (state.changes[i].service.name === service.name) {
                    state.changes.splice(i, 1);
                    i = -1;
                }
            }
        },
        addServiceToRipple(state, service: IService) {
            state.serviceNames.push(service.name);
        },
        removeServiceFromRipple(state, service: IService) {
            const index = state.serviceNames.findIndex(
                serviceAr => serviceAr === service.name
            );
            state.serviceNames.splice(index, 1);
        },
        addCreatedService(state, service: IService) {
            state.createdServicesScenario.push(service);
        },
        deleteCreatedService(state, service: IService) {
            const index = state.createdServicesScenario.findIndex(
                crService => crService.name === service.name
            );
            state.createdServicesScenario.splice(index, 1);
        }
    }
});

/**
 * @decorator
 *
 * With this decorator you can map any property in a normal class to a stored value in the Store.
 * If you call the get/set the property the get/set function is going to be replaced with getters/setters
 * stored in the DecoratorFactory.
 *
 * Has to stay in this file to avoid circular dependencies. (needs AppStore instance)
 *
 * @param namespace - namespace representing a StateModule
 * @param fieldName - a override for the key if the variable is local key is called different
 */
export function ClassStateField(namespace: StateModule, fieldName?: string) {
    return (target: any, key: string | symbol) => {
        const keyName = fieldName
            ? namespace.toString() + "/" + fieldName.toString()
            : namespace.toString() + "/" + key.toString();

        const getter = () => {
            return AppStore.getters[keyName];
        };

        const setter = value => {
            AppStore.commit(keyName, value);
        };

        return {
            get: getter,
            set: setter
        } as any;
    };
}
