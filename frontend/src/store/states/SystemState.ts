import { State, StateHandler } from "../State";

/**
 * this class puts general variables into the Vuex store
 */
@StateHandler()
export class SystemState extends State {
    public static editingSystem: boolean = false;
    public static systemID: string = "";
    public static systemName: string = "";
    public static rippleUpdate: boolean = false;
}
