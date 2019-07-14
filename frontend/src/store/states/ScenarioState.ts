import { State, StateHandler } from "../State";

/**
 * this class puts general variables into the Vuex store
 */
@StateHandler()
export class ScenarioState extends State {
    public static editingScenario: boolean = false;
    public static startCreatingScenario: boolean = false;
}
