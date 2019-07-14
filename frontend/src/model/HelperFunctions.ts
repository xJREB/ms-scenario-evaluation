/**
 * this class wraps helper functions
 */
import { ClassStateField, StateModule } from "../store/AppStore";

export default class HelperFunctions {
    @ClassStateField(StateModule.GENERAL)
    public error: string;

    @ClassStateField(StateModule.GENERAL)
    public disableElements: boolean;

    @ClassStateField(StateModule.GENERAL)
    public firstSave: boolean;

    @ClassStateField(StateModule.GENERAL)
    public errorBool: boolean;

    constructor() {
        //
    }

    public showError(message, timeout, errorBool) {
        this.error = message;
        const self = this;
        this.firstSave = false;
        this.errorBool = errorBool;
        setTimeout(() => {
            self.error = "";
            self.disableElements = false;
        }, timeout);
    }
}
