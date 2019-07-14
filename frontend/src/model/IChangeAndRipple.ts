import IChange from "./IChange";
import IService from "./IService";

export default interface IChangeAndRipple {
    change: IChange;
    ripples: IService[];
}
