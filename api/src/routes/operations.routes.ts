import { Request, Response, Router } from "express";
// Mongo stuff
import * as mongoose from "mongoose";
import { calcScenarioEffort, evaluation, findCriticalServiceEffort } from "../evaluation";
import { IAdvancedScenarios, IChange, IScenario, IService, ISystem, ISystemEvaluation } from "../interfaces";
import Change from "../models/Change";
import Scenario from "../models/Scenario";
import Service from "../models/Service";
import System from "../models/System";

const router: Router = Router();

mongoose.connect(`mongodb://${process.env.DB_HOST}`, {
    useNewUrlParser: true,
    dbName: process.env.DB_NAME
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

// get an entire evaluation system with all evaluation attributes
router.get("/systems/:id/evaluation", (req: Request, res: Response) => {
    startEvaluation(res, req);
});

/**
 * this method starts the evaluation by getting the system with all services and scenarios and changes in JSON format.
 * this is required to build the evaluation system.
 * First you get the system from the database and convert it to JSON. The problem with this system is, that its
 * services, scenarios and changes are only ObjectIDs, so it need to be converted as well in real JSON objects
 * @param res
 * @param req
 */
function startEvaluation(res, req) {
    // find the system by its name
    System.findById(req.params.id).then(systemBack => {
        if (systemBack) {
            const system: ISystem = systemBack.toJSON();
            attachScenariosToSystem(res, system);
        }
    });
}

/**
 * this method attach all scenarios to the system in JSON format
 * @param res
 * @param system
 */
function attachScenariosToSystem(res, system) {
    // attach the scenarios for the system
    Scenario.find({ system: system._id }).then(scenariosBack => {
        const scenarios: IScenario[] = [];
        scenariosBack.forEach(scenario => {
            scenarios.push(scenario.toJSON());
        });
        system.scenarios = scenarios.slice(0);
        attachServicesToSystem(res, system);
    });
}

/**
 * this method attach all services to the system in JSON format
 * @param res
 * @param system
 */
function attachServicesToSystem(res, system) {
    // attach the services for the system
    Service.find({ system: system._id }).then(servicesBack => {
        const services: IService[] = [];
        servicesBack.forEach(servicesBackSingle => {
            services.push(servicesBackSingle.toJSON());
        });
        system.services = services.slice(0);
        attachChangesToScenarios(res, system);
    });
}

/**
 * this method attach all changes to the scenarios in JSON format, because they are only ObjectIDs now.
 * @param res
 * @param system
 */
function attachChangesToScenarios(res, system) {
    // get all changes from the DB
    Change.find().then(changes => {
        const changesJSON: IChange[] = [];
        changes.forEach(change => {
            changesJSON.push(change.toJSON());
        });
        // filter the changes on the scenarios for the system
        system.scenarios.forEach(scenario => {
            const changesJSONResult = [];
            changesJSON.forEach(change => {
                if (change.scenario.toString() === scenario._id.toString()) {
                    changesJSONResult.push(change);
                }
            });
            // attach the changes to a scenario
            scenario.changes = changesJSONResult.slice(0);
        });
        calculateScenarioEffort(res, system);
    });
}

/**
 * this method calculate the effort for all scenarios
 * @param res
 * @param system
 */
function calculateScenarioEffort(res, system) {
    // check if the system has scenarios
    if (system.scenarios.length > 0) {
        // get all scenarios for the system
        const query = system._id ? { system: system._id } : {};
        Promise.all([
            Scenario.find(query)
                .populate({ path: "system", select: "_id name" })
                .exec(),
            Change.find()
                .populate({ path: "service", select: "_id name" })
                .exec()
        ]).then(results => {
            // if no scenarios exist, just return an empty array
            if (results[0].length === 0) {
                return res.json([]);
            }
            // otherwise, attach all changes for each scenario and calculate hardestChange
            results[0].forEach((scenario: any) => {
                scenario.changes = results[1].filter(
                    (service: any) =>
                        String(service.scenario._id) === String(scenario._id)
                );
                // calc the scenario effort
                const result = calcScenarioEffort(scenario);
                scenario.scenarioEffortOrdinal = result.scenarioEffortOrdinal;
                scenario.scenarioMaintenanceEffort =
                    result.scenarioMaintenanceEffort;
                scenario.scenarioEffortHours = result.scenarioEffortHours;
                scenario.scenarioEffortCosmic = result.scenarioEffortCosmic;
                scenario.scenarioEffortStoryPoints =
                    result.scenarioEffortStoryPoints;
            });
            createScenariosChangesJSONs(res, system, results);
        });
    }
}

/**
 * this method convert the changes to JSON
 * @param res
 * @param system
 * @param results
 */
function createScenariosChangesJSONs(res, system, results) {
    const scenarios: IScenario[] = [];
    const changesJSON = [];
    results[0].forEach(result => {
        scenarios.push(result.toJSON());
    });
    // get all changes from the DB
    Change.find().then(changes => {
        changes.forEach(change => {
            changesJSON.push(change.toJSON());
        });
        // filter the changes on the scenarios for the system
        const changesJSONResult = [];
        scenarios.forEach(scenario => {
            changesJSON.forEach(change => {
                if (change.scenario.toString() === scenario._id.toString()) {
                    changesJSONResult.push(change);
                }
            });
        });
        createEvaluationData(res, system, scenarios, changesJSONResult);
    });
}

/**
 * Now we have a system with its services, scenarios, and changes in JSON format, so we can start calculating the
 * evaluation features and collect them in an evaluation system.
 * this method creates the respond for the request. It sends an evaluation system.
 * @param res
 * @param system
 * @param scenarios
 * @param changesJSONResult
 */
function createEvaluationData(res, system, scenarios, changesJSONResult) {
    // get most data for building the evaluation system
    const result = evaluation(system, scenarios, changesJSONResult);
    // convert the criticalService id into a service
    Service.findById(result.criticalService)
        .populate({ path: "system", select: "_id name description" })
        .then(service => {
            if (service) {
                // convert the service ids in the pieChartArrayServicesChangeMost in names
                const query = system._id ? { system: system._id } : {};
                Service.find(query)
                    .populate({ path: "system", select: "_id name" })
                    .then(services => {
                        services.forEach(serviceDoc => {
                            const serviceJ = serviceDoc.toJSON();
                            for (
                                let i = 1;
                                i <
                                result.pieChartArrayServicesChangeMost.length;
                                i++
                            ) {
                                if (
                                    result.pieChartArrayServicesChangeMost[
                                        i
                                    ][0].toString() === serviceJ._id.toString()
                                ) {
                                    result.pieChartArrayServicesChangeMost[
                                        i
                                    ][0] = serviceJ.name;
                                }
                            }
                        });
                        // the systems scenarios now still only includes only change ObjectIDs, so they need to be converted to
                        // real JSON objects
                        convertChangesServiceIDsTOServices(system);
                        // get the service effort for each estimation method. The result critical service includes the service with
                        // with highest and lowest effort by its name and the exact effort number. The object has also a sorted
                        // array with all services and their effort. The array is sorted by the effort
                        const criticalServiceEfforts = [];
                        for (let i = 0; i <= 4; i++) {
                            criticalServiceEfforts.push(
                                findCriticalServiceEffort(i + 1, system)
                            );
                        }

                        // build the advanced scenarios
                        const advancedScenariosHours = buildAdvancedScenarios(
                            scenarios,
                            1,
                            system
                        );
                        const advancedScenariosOrdinal = buildAdvancedScenarios(
                            scenarios,
                            2,
                            system
                        );
                        const advancedScenariosCosmic = buildAdvancedScenarios(
                            scenarios,
                            4,
                            system
                        );
                        const advancedScenariosStory = buildAdvancedScenarios(
                            scenarios,
                            5,
                            system
                        );

                        createEvaluationResponse(
                            res,
                            system,
                            result,
                            criticalServiceEfforts,
                            advancedScenariosCosmic,
                            advancedScenariosHours,
                            advancedScenariosOrdinal,
                            advancedScenariosStory,
                            service,
                            scenarios
                        );
                    });
            }
        });
}

/**
 * finally after we calculated all the necessary evaluation features we can build the evaluation system and send it
 * back to the front end.
 * @param res
 * @param system
 * @param result
 * @param criticalServiceEfforts
 * @param advancedScenariosCosmic
 * @param advancedScenariosHours
 * @param advancedScenariosOrdinal
 * @param advancedScenariosStory
 * @param service
 * @param scenarios
 */
function createEvaluationResponse(
    res,
    system,
    result,
    criticalServiceEfforts,
    advancedScenariosCosmic,
    advancedScenariosHours,
    advancedScenariosOrdinal,
    advancedScenariosStory,
    service,
    scenarios
) {
    const evaluationSystem = {
        advancedScenariosCosmic,
        advancedScenariosHours,
        advancedScenariosOrdinal,
        advancedScenariosStory,
        categories: result.categories,
        criticalService: service.toJSON(),
        criticalServiceEffortCosmic: {
            serviceHighestEffort:
                criticalServiceEfforts[3].serviceHighestEffort,
            serviceHighestEffortNumber:
                criticalServiceEfforts[3].serviceHighestEffortNumber,
            serviceLowestEffort: criticalServiceEfforts[3].serviceLowestEffort,
            serviceLowestEffortNumber:
                criticalServiceEfforts[3].serviceLowestEffortNumber,
            servicesEffortArray: criticalServiceEfforts[3].servicesEffortArray
        },
        criticalServiceEffortHours: {
            serviceHighestEffort:
                criticalServiceEfforts[0].serviceHighestEffort,
            serviceHighestEffortNumber:
                criticalServiceEfforts[0].serviceHighestEffortNumber,
            serviceLowestEffort: criticalServiceEfforts[0].serviceLowestEffort,
            serviceLowestEffortNumber:
                criticalServiceEfforts[0].serviceLowestEffortNumber,
            servicesEffortArray: criticalServiceEfforts[0].servicesEffortArray
        },
        criticalServiceEffortOrdinal: {
            serviceHighestEffort:
                criticalServiceEfforts[1].serviceHighestEffort,
            serviceHighestEffortNumber:
                criticalServiceEfforts[1].serviceHighestEffortNumber,
            serviceLowestEffort: criticalServiceEfforts[1].serviceLowestEffort,
            serviceLowestEffortNumber:
                criticalServiceEfforts[1].serviceLowestEffortNumber,
            servicesEffortArray: criticalServiceEfforts[1].servicesEffortArray
        },
        criticalServiceEffortStory: {
            serviceHighestEffort:
                criticalServiceEfforts[4].serviceHighestEffort,
            serviceHighestEffortNumber:
                criticalServiceEfforts[4].serviceHighestEffortNumber,
            serviceLowestEffort: criticalServiceEfforts[4].serviceLowestEffort,
            serviceLowestEffortNumber:
                criticalServiceEfforts[4].serviceLowestEffortNumber,
            servicesEffortArray: criticalServiceEfforts[4].servicesEffortArray
        },
        effortCosmic: result.effortCosmic,
        effortHours: result.effortHours,
        effortStoryPoints: result.effortStoryPoints,
        linesOfCodeEffort: result.linesOfCodeEffort,
        ordinalEffort: result.ordinalEffort,
        pieChartArrayServicesChangeMost: result.pieChartArrayServicesChangeMost,
        scenarios,
        servicesAffectedTotal: result.servicesAffected,
        servicesAffectedTotalServices: result.servicesAffectedTotalServices,
        servicesNumber: result.servicesNumber,
        systemName: system.name
    } as ISystemEvaluation;
    res.json({ message: "success", evaluationSystem });
}

/**
 * this function create the advanced scenarios, which are the evaluation for a single scenarios. The effort for a
 * advanced scenario is based on the effort estimation method (design) that is selected.
 * @param scenarios
 * @param design
 * @param system
 */
function buildAdvancedScenarios(scenarios: IScenario[], design, system) {
    const advancedScenarios: IAdvancedScenarios[] = [];
    // calculate for each scenario the advanced scenario
    scenarios.forEach(scenario => {
        // first get collect all changes in an array
        const changesJSON: IChange[] = [];
        scenario.changes.forEach(change => {
            changesJSON.push(change);
        });
        // the most impactful change is the change, that affect most services => the change that has the most ripples
        const changesMostRipples: IChange[] = changesJSON.slice(0);
        changesMostRipples.sort((a: IChange, b: IChange) => {
            return b.ripples.length - a.ripples.length;
        });
        // later the most difficult and easiest change in terms of effort should be determined.
        // the easiest way to do so is to sort the changes by effort and give back the first and last element of the sorted
        // change array
        sortChangesByDesignAndEffortNew(design, changesJSON);
        // to determine how many services are affected in the scenario all services of a change including its ripples are
        // pushed into an array. Then this array will be filtered, so that only unique services are in the array. After that
        // an array with deleted services will be created. The unique service array will be filtered according to what
        // services are hypothetically deleted.
        const services: any[] = getAffectedServices(changesJSON);
        const deletedServices = getDeletedServices(system);
        const uniqueServices = getUniqueAffectedServices(services);
        const uniqueDeletedServices = getUniqueDeletedServices(deletedServices);
        filterDeletedServicesOutOfAffectedServices(
            uniqueDeletedServices,
            uniqueServices
        );
        // create an advanced scenario
        advancedScenarios.push({
            affectedServices: uniqueServices.length,
            category: scenario.category,
            changeHighestEffort:
                changesJSON[0].type + ":" + changesJSON[0].description,
            changeLowestEffort:
                changesJSON[changesJSON.length - 1].type +
                ":" +
                changesJSON[changesJSON.length - 1].description,
            changesLength: scenario.changes.length,
            changesMostRipples:
                changesMostRipples[0].type +
                ":" +
                changesMostRipples[0].description +
                " / affects " +
                (changesMostRipples[0].ripples.length + 1) +
                " services",
            name: scenario.name,
            scenarioEffort: scenario.scenarioEffortHours,
            tags: scenario.tags
        });
        // in a final step, the correct effort for the advanced scenario has to be set in terms of the design (effort
        // estimation method)
        setCorrectAdvancedScenarioEffort(
            advancedScenarios[
                system.scenarios.findIndex(
                    s => s._id.toString() === scenario._id.toString()
                )
            ],
            design,
            scenario
        );
    });
    return advancedScenarios;
}

/**
 * this method set the correct effort for an advanced scenario according to the selected design.
 * @param advancedScenario
 * @param design
 * @param scenario
 */
export function setCorrectAdvancedScenarioEffort(
    advancedScenario: IAdvancedScenarios,
    design,
    scenario: IScenario
) {
    if (design === 1) {
        advancedScenario.scenarioEffort = scenario.scenarioEffortHours;
    }
    if (design === 2) {
        advancedScenario.scenarioEffort = scenario.scenarioEffortOrdinal;
    }
    if (design === 4) {
        advancedScenario.scenarioEffort = scenario.scenarioEffortCosmic;
    }
    if (design === 5) {
        advancedScenario.scenarioEffort = scenario.scenarioEffortStoryPoints;
    }
}

/**
 * this method converts the service ID of a change service in a real service object
 * @param system
 */
export function convertChangesServiceIDsTOServices(system) {
    system.scenarios.forEach(scenario => {
        scenario.changes.forEach(change => {
            const index = system.services.findIndex(
                service => service._id.toString() === change.service.toString()
            );
            change.service = system.services[index];
        });
    });
}

/**
 * this method sort the changes in JSON format according to what effort estimation method is selected
 * @param design
 * @param changesJSON
 */
function sortChangesByDesignAndEffortNew(design, changesJSON) {
    if (design === 1) {
        changesJSON.sort((a: IChange, b: IChange) => {
            return b.effortHours - a.effortHours;
        });
    }
    if (design === 2) {
        changesJSON.sort((a: IChange, b: IChange) => {
            return b.effortOrdinal - a.effortOrdinal;
        });
    }
    if (design === 3) {
        changesJSON.sort((a: IChange, b: IChange) => {
            return b.effortCodeNew - a.effortCodeNew;
        });
    }
    if (design === 4) {
        changesJSON.sort((a: IChange, b: IChange) => {
            return b.effortCosmicFunctionPoints - a.effortCosmicFunctionPoints;
        });
    }
    if (design === 5) {
        changesJSON.sort((a: IChange, b: IChange) => {
            return b.effortStoryPoints - a.effortStoryPoints;
        });
    }
}

/**
 * this method returns all affected services
 * @param changesJSON
 */
function getAffectedServices(changesJSON) {
    const services: any[] = [];
    // get all affected services
    changesJSON.forEach(change => {
        services.push(change.service);
        change.ripples.forEach(ripple => {
            services.push(ripple);
        });
    });
    return services;
}

/**
 * this method returns all services that are deleted hypothetically
 * @param system
 */
function getDeletedServices(system) {
    const deletedServices = [];
    // browse through all changes and search for deleted services
    system.scenarios.forEach(scenario => {
        scenario.changes.forEach(change => {
            if (change.type.toString() === "deletion") {
                deletedServices.push(change.service._id);
            }
        });
    });

    return deletedServices;
}

/**
 * this method returns the unique services of all affected services
 * @param services
 */
function getUniqueAffectedServices(services) {
    // filter multiple services in the array so that it only has unique elements
    const uniqueServices = services.slice(0);
    for (let i = 0; i < uniqueServices.length - 1; i++) {
        for (let j = i + 1; j < uniqueServices.length; j++) {
            if (uniqueServices[i].toString() === uniqueServices[j].toString()) {
                uniqueServices.splice(j, 1);
                j = i + 1;
            }
        }
    }

    return uniqueServices;
}

/**
 * this method returns the unique services of all deleted services
 * @param deletedServices
 */
function getUniqueDeletedServices(deletedServices) {
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

    return uniqueDeletedServices;
}

/**
 * this method filter the deleted services out ot the unique affected services
 * @param uniqueDeletedServices
 * @param uniqueServices
 */
function filterDeletedServicesOutOfAffectedServices(
    uniqueDeletedServices,
    uniqueServices
) {
    // filter deleted services
    uniqueDeletedServices.forEach(deletion => {
        const index = uniqueServices.findIndex(service => {
            return service.toString() === deletion.toString();
        });
        if (index !== -1) {
            uniqueServices.splice(index, 1);
        }
    });
}

export { router };

