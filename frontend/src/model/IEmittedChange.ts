import IChange from "./IChange";

export default interface IEmittedChange {
    change: IChange;
    rippleNames: string[];
    affectedService: string;
}
