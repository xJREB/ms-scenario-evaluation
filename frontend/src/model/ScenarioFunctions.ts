/**
 * this class wraps helper functions
 */
import { AppStore, ClassStateField, StateModule } from "../store/AppStore";
import IService from "./IService";

export default class ScenarioFunctions {
    @ClassStateField(StateModule.GENERAL)
    public error: string;

    @ClassStateField(StateModule.GENERAL)
    public disableElements: boolean;

    @ClassStateField(StateModule.GENERAL)
    public firstSave: boolean;

    @ClassStateField(StateModule.GENERAL)
    public errorBool: boolean;

    @ClassStateField(StateModule.GENERAL)
    public timeout: number;

    @ClassStateField(StateModule.SCENARIO)
    public editingScenario: boolean;

    constructor() {
        //
    }

    public setChangeInAppStore(data, affectedService, actualSystem) {
        const ripples = this.convertRippleNamesToRippleService(
            data,
            actualSystem
        );
        AppStore.commit("setChange", {
            cosmicType: data.change.cosmicType,
            description: data.change.description,
            effortCodeNew: data.change.effortCodeNew,
            effortCosmicFunctionPoints: data.change.effortCosmicFunctionPoints,
            effortHours: data.change.effortHours,
            effortOrdinal: data.change.effortOrdinal,
            effortStoryPoints: data.change.effortStoryPoints,
            ripples,
            scenarioName: AppStore.state.scenario.name,
            service: affectedService,
            type: data.change.type
        });
    }

    public convertRippleNamesToRippleService(data, actualSystem) {
        // find all ripple services
        const ripples = Array<IService>();
        let indexService = 0;
        data.rippleNames.forEach(ripple => {
            indexService = actualSystem.services.findIndex(service => {
                return service.name === ripple;
            });
            if (indexService !== -1) {
                ripples.push(actualSystem.services[indexService]);
            } else {
                ripples.push({} as IService);
            }
        });
        // eliminate the affected service of the ripples
        indexService = ripples.findIndex(
            service => service.name === data.affectedService
        );
        if (indexService !== -1) {
            ripples.splice(indexService, 1);
        }
        return ripples;
    }

    public resetAppStore() {
        AppStore.commit("resetSystem");
        AppStore.commit("resetService");
        AppStore.commit("resetServices");
        AppStore.commit("resetScenario");
        AppStore.commit("resetSystemNames");
        AppStore.commit("resetChanges");
        AppStore.commit("resetChange");
        AppStore.commit("resetCreatedServices");
        this.editingScenario = false;
        this.disableElements = false;
    }
}
