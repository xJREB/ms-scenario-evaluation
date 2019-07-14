import { State, StateHandler } from "../State";

/**
 * this class puts app variable into the Vuex store
 */
@StateHandler()
export class AppState extends State {
    public static drawer: boolean = false;
}
