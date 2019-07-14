import * as mongoose from "mongoose";
import { IChange, IScenario, IService, ISystem, ISystemEvaluation } from "./interfaces";
import Scenario from "./models/Scenario";

mongoose.connect(`mongodb://${process.env.DB_HOST}`, {
    useNewUrlParser: true,
    dbName: process.env.DB_NAME
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// this method calculates scenario efforts and checks whether no ripples were forgotten
export default function evaluate(scenarios, changes) {
    // check if all ripples are accouted for
    const unaccountedRipples = [];
    changes.forEach(change => {
        change.ripples.forEach(ripple => {
            if (ripple !== "") {
                const rip = changes.find(element => {
                    return element.service === ripple;
                });
                if (!rip) {
                    unaccountedRipples.push({
                        scenario: change.scenario,
                        service: ripple
                    });
                }
            }
        });
    });

    // calculate scenario efforts
    scenarios.forEach(scenario => {
        scenario.scenarioEffort = 0;
        changes.forEach(change => {
            if (change.scenarioID === scenario._id) {
                scenario.scenarioEffort += change.effort;
            }
        });
        Scenario.updateOne(
            { _id: scenario._id },
            { $set: { scenarioEffort: scenario.scenarioEffort } },
            e => {
                if (e) {
                    return console.error(e);
                }
            }
        );
    });
    return unaccountedRipples;
}

/**
 * this method calculate the total effort for each design
 */
export function getEffort(system, scenarios) {
    let totalChanges = 0;
    let categories = [];
    let effortHours = 0;
    let ordinalEffort = 0;
    let maintainanceEffort = 0;
    let effortCosmic = 0;
    let effortStoryPoints = 0;
    scenarios.forEach(scenario => {
        effortHours += scenario.scenarioEffortHours;
        ordinalEffort += scenario.scenarioEffortOrdinal;
        maintainanceEffort += scenario.scenarioMaintenanceEffort;
        effortCosmic += scenario.scenarioEffortCosmic;
        effortStoryPoints += scenario.scenarioEffortStoryPoints;
        totalChanges += scenario.changes.length;
        categories.push(scenario.category);
    });
    // filter multiple categories
    categories = categories.filter((item, pos) => {
        return categories.indexOf(item) === pos;
    });
    // add no category to the categories
    categories.push("No filter");
    return {
        ordinalEffort,
        maintainanceEffort,
        effortHours,
        categories,
        effortCosmic,
        effortStoryPoints
    };
}

/**
 * this method find the critical service
 */
export function findCriticalService(services, system) {
    const servicesWithoutAdditions = [];
    const servicesWithoutAdditionsTemp = system.services.slice(0);
    for (let i = 0; i < servicesWithoutAdditionsTemp.length; i++) {
        if (servicesWithoutAdditionsTemp[i].name.includes("[new addition]")) {
            servicesWithoutAdditionsTemp.splice(i, 1);
            i = -1;
        }
    }
    system.scenarios.forEach(scenario => {
        scenario.changes.forEach(change => {
            let index = servicesWithoutAdditionsTemp.findIndex(
                service => service._id === change.service.toString()
            );
            if (index === -1) {
                servicesWithoutAdditions.push(change.service);
            }
            change.ripples.forEach(ripple => {
                index = servicesWithoutAdditionsTemp.findIndex(
                    service => service._id === ripple.toString()
                );
                if (index === -1) {
                    servicesWithoutAdditions.push(ripple);
                }
            });
        });
    });

    // prepare an array for a google chart
    const pieChartArray = [["Service", "Number of changes"]];
    const chartPrep = [];
    // first get an array with all unique services that change
    const uniqueServices = [];
    servicesWithoutAdditionsTemp.forEach(service => {
        uniqueServices.push(service._id);
    });

    // create a preparation array of all services that change and how often they change
    uniqueServices.forEach(serviceUnique => {
        chartPrep.push({
            count: servicesWithoutAdditions.filter(
                service => service.toString() === serviceUnique.toString()
            ).length,
            service: serviceUnique
        });
    });
    // sort the preparation array
    chartPrep.sort((a, b) => {
        return b.count - a.count;
    });

    // finally create the piechart array
    chartPrep.forEach(element => {
        pieChartArray.push([element.service, element.count]);
    });

    if (pieChartArray[1][1] === null || pieChartArray[1][1] === undefined) {
        return {
            criticalService: { name: "", _id: "" } as IService,
            criticalServiceNumber: "",
            pieChartArrayServicesChangeMost: pieChartArray
        };
    } else {
        return {
            criticalService: pieChartArray[1][0],
            criticalServiceNumber: pieChartArray[1][1],
            pieChartArrayServicesChangeMost: pieChartArray
        };
    }
}

/**
 * this method return the total affected services and the critical service
 */
export function getTotalAffectedServices(system, scenarios, changes) {
    const services: any[] = [];
    const deletedServices: any[] = [];
    const totalServices = [];
    // put the service id in the totalServices
    system.services.forEach(service => {
        totalServices.push(service._id);
    });
    changes.forEach(change => {
        if (change.type !== "deletion") {
            services.push(change.service);
            change.ripples.forEach(ripple => {
                services.push(ripple);
            });
            // if a services was added by a change then put it also in totalServices
            if (change.type === "addition") {
                totalServices.push(change.service);
            }
        } else {
            deletedServices.push(change.service);
            change.ripples.forEach(ripple => {
                services.push(ripple);
            });
        }
    });
    // set the critical service that is most often modified by the changes
    const criticalServiceObj = this.findCriticalService(services, system);
    // filter multiple services out
    const uniqueServices = services.slice(0);
    for (let i = 0; i < uniqueServices.length - 1; i++) {
        for (let j = i + 1; j < uniqueServices.length; j++) {
            if (uniqueServices[i].toString() === uniqueServices[j].toString()) {
                uniqueServices.splice(j, 1);
                j = i + 1;
            }
        }
    }
    const uniqueDeletedServices = deletedServices.slice(0);
    for (let i = 0; i < uniqueDeletedServices.length - 1; i++) {
        for (let j = i + 1; j < uniqueDeletedServices.length; j++) {
            if (
                uniqueDeletedServices[i].toString() ===
                uniqueDeletedServices[j].toString()
            ) {
                uniqueDeletedServices.splice(j, 1);
                j = i + 1;
            }
        }
    }
    const uniqueTotalServices = totalServices.slice(0);
    for (let i = 0; i < uniqueTotalServices.length - 1; i++) {
        for (let j = i + 1; j < uniqueTotalServices.length; j++) {
            if (
                uniqueTotalServices[i].toString() ===
                uniqueTotalServices[j].toString()
            ) {
                uniqueTotalServices.splice(j, 1);
                j = i + 1;
            }
        }
    }
    // filter deleted services
    uniqueDeletedServices.forEach(deletion => {
        let index = uniqueServices.findIndex(
            service => service.toString() === deletion.toString()
        );
        if (index !== -1) {
            uniqueServices.splice(index, 1);
        }
        index = uniqueTotalServices.findIndex(
            service => service.toString() === deletion.toString()
        );
        if (index !== -1) {
            uniqueTotalServices.splice(index, 1);
        }
    });
    return {
        criticalService: criticalServiceObj.criticalService,
        pieChartArrayServicesChangeMost:
            criticalServiceObj.pieChartArrayServicesChangeMost,
        servicesAffected: uniqueServices.length,
        servicesAffectedTotalServices: uniqueServices,
        servicesNumber: uniqueTotalServices.length
    };
}

/**
 * this method return the entire evaluation data of a system
 */
export function evaluation(
    system: ISystem,
    scenarios: IScenario[],
    changes: IChange[]
) {
    const services = this.getTotalAffectedServices(system, scenarios, changes);
    const effort = this.getEffort(system, scenarios);
    return {
        categories: effort.categories,
        criticalService: services.criticalService,
        effortCosmic: effort.effortCosmic,
        effortHours: effort.effortHours,
        effortStoryPoints: effort.effortStoryPoints,
        linesOfCodeEffort: effort.maintainanceEffort,
        ordinalEffort: effort.ordinalEffort,
        pieChartArrayServicesChangeMost:
            services.pieChartArrayServicesChangeMost,
        servicesAffected: services.servicesAffected,
        servicesAffectedTotalServices: services.servicesAffectedTotalServices,
        servicesNumber: services.servicesNumber
    };
}

/**
 * this method calculate the effort for a scenario
 * @param scenario
 */
export function calcScenarioEffort(scenario) {
    // calc the effort
    let effortOrdinal: number = 0;
    let effortHours: number = 0;
    let effortNewCode: number = 0;
    let effortCosmic: number = 0;
    let effortStoryPoints: number = 0;
    scenario.changes.forEach(change => {
        effortHours += Number(change.effortHours);
        effortOrdinal += Number(change.effortOrdinal);
        effortNewCode += Number(change.effortCodeNew);
        effortCosmic += Number(change.effortCosmicFunctionPoints);
        effortStoryPoints += Number(change.effortStoryPoints);
    });
    effortOrdinal /= scenario.changes.length;

    scenario.scenarioEffortOrdinal = Math.round(effortOrdinal * 100) / 100;
    scenario.scenarioMaintenanceEffort = Math.round(effortNewCode);
    scenario.scenarioEffortHours = effortHours;
    scenario.scenarioEffortCosmic = effortCosmic;
    scenario.scenarioEffortStoryPoints = effortStoryPoints;

    return {
        scenarioEffortCosmic: scenario.scenarioEffortCosmic,
        scenarioEffortHours: scenario.scenarioEffortHours,
        scenarioEffortOrdinal: scenario.scenarioEffortOrdinal,
        scenarioEffortStoryPoints: scenario.scenarioEffortStoryPoints,
        scenarioMaintenanceEffort: scenario.scenarioMaintenanceEffort
    };
}

/**
 * this method finds the critical service that is changed most
 * @param designNumber
 * @param evaluationSystem
 */
export function findCriticalServiceEffort(
    designNumber: number,
    evaluationSystem
) {
    if (evaluationSystem.scenarios !== undefined) {
        let servicesAndEffort = [];
        if (designNumber === 1) {
            servicesAndEffort = this.getServicesAndEffortHours(
                evaluationSystem
            );
        }
        if (designNumber === 2) {
            servicesAndEffort = this.getServicesAndEffortOrdinal(
                evaluationSystem
            );
        }
        if (designNumber === 3) {
            servicesAndEffort = this.getServicesAndEffortLinesOfCode(
                evaluationSystem
            );
        }
        if (designNumber === 4) {
            servicesAndEffort = this.getServicesAndEffortCosmic(
                evaluationSystem
            );
        }
        if (designNumber === 5) {
            servicesAndEffort = this.getServicesAndEffortStoryPoints(
                evaluationSystem
            );
        }
        return this.setCriticalService(servicesAndEffort, evaluationSystem);
    }
}

/**
 * returns a service and its effort in hours
 * @param evaluationSystem
 */
export function getServicesAndEffortHours(evaluationSystem) {
    const servicesAndEffort = [];
    // put all services from the changes and their effort in a array
    evaluationSystem.scenarios.forEach(scenario => {
        scenario.changes.forEach(change => {
            servicesAndEffort.push({
                effort: change.effortHours,
                service: change.service
            });
        });
    });
    return servicesAndEffort;
}

/**
 * returns a service and its effort in an ordinal scale
 * @param evaluationSystem
 */
export function getServicesAndEffortOrdinal(evaluationSystem) {
    const servicesAndEffort = [];
    // put all services from the changes and their effort in a array
    evaluationSystem.scenarios.forEach(scenario => {
        scenario.changes.forEach(change => {
            servicesAndEffort.push({
                effort: change.effortOrdinal,
                service: change.service
            });
        });
    });
    return servicesAndEffort;
}

/**
 * returns a service and its effort in lines of code
 * @param evaluationSystem
 */
export function getServicesAndEffortLinesOfCode(evaluationSystem) {
    const servicesAndEffort = [];
    // put all services from the changes and their effort in a array
    evaluationSystem.scenarios.forEach(scenario => {
        scenario.changes.forEach(change => {
            servicesAndEffort.push({
                effort: change.effortCodeNew,
                service: change.service
            });
        });
    });
    return servicesAndEffort;
}

/**
 * returns a service and its effort in cosmic function points
 * @param evaluationSystem
 */
export function getServicesAndEffortCosmic(evaluationSystem) {
    const servicesAndEffort = [];
    // put all services from the changes and their effort in a array
    evaluationSystem.scenarios.forEach(scenario => {
        scenario.changes.forEach(change => {
            servicesAndEffort.push({
                effort: change.effortCosmicFunctionPoints,
                service: change.service
            });
        });
    });
    return servicesAndEffort;
}

/**
 * returns a service and its effort in story points
 * @param evaluationSystem
 */
export function getServicesAndEffortStoryPoints(evaluationSystem) {
    const servicesAndEffort = [];
    // put all services from the changes and their effort in a array
    evaluationSystem.scenarios.forEach(scenario => {
        scenario.changes.forEach(change => {
            servicesAndEffort.push({
                effort: change.effortStoryPoints,
                service: change.service
            });
        });
    });
    return servicesAndEffort;
}

/**
 * this method sets the critical service with the highest effort and lowest effort. It returns also an array with all
 * services and their effort for a pie chart in the front end
 * @param servicesAndEffort
 * @param evaluationSystem
 */
export function setCriticalService(
    servicesAndEffort,
    evaluationSystem: ISystemEvaluation
) {
    for (let i = 0; i < servicesAndEffort.length; i++) {
        if (servicesAndEffort[i].service.name.includes("[new addition]")) {
            servicesAndEffort.splice(i, 1);
            i = -1;
        }
    }

    // calculate the result array that have all summed up effort for a service in it. It is also sorted according
    // to the effort
    let result = [];
    servicesAndEffort.forEach(service => {
        result.push({
            serviceName: service.service.name,
            effort: service.effort
        });
    });

    const counts = result.reduce((prev, curr) => {
        const count = prev.get(curr.serviceName) || 0;
        prev.set(curr.serviceName, curr.effort + count);
        return prev;
    }, new Map());

    result = [...counts].map(([serviceName, effort]) => {
        return { serviceName, effort };
    });

    result.sort((a, b) => {
        return b.effort - a.effort;
    });

    // eliminate duplicate services
    result = result.filter(
        (obj, index, self) =>
            index === self.findIndex(t => t.serviceName === obj.serviceName)
    );

    // create the data structure for the pie chart in the front end that displays services and their effort
    const pieChartArray = [["Service", "Effort"]];
    result.forEach(ele => {
        pieChartArray.push([ele.serviceName, ele.effort]);
    });

    if (result.length > 0) {
        return {
            serviceHighestEffort: result[0].serviceName,
            serviceHighestEffortNumber: result[0].effort,
            serviceLowestEffort: result[result.length - 1].serviceName,
            serviceLowestEffortNumber: result[result.length - 1].effort,
            servicesEffortArray: pieChartArray
        };
    }
    return "";
}
