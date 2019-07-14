import { Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import { changeAlgorithm, changeAPI, changeBitcoin, changeDatabaseD, changeDatabaseP, changeEthereum, changeGiroPay, changeNotificationDArrived, changeNotificationDRated, changeReimplementDUI, changeReimplementPUI, changeValidation, changeWebFramework, createBillingService, createDriverManagement, createDriverWebUI, createNotificationSerivce, createPassengerService, createPassengerWebUI, createPaymentService, createSystem, createTripManagementService, scenarioBetterTrio, scenarioDatabase, scenarioDesignUserFriendly, scenarioNotifications, scenarioPaymentMethod, scenarioValidation } from "../exampleSystem";
import { ISystem } from "../interfaces";
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

// set here the example system
let firstCreation = false;
db.on("open", () => {
    db.db.listCollections().toArray((err, collectionNames) => {
        if (err) {
            return;
        }
        if (!firstCreation) {
            firstCreation = true;
            if (collectionNames.length === 0) {
                const systemID = createSystem();
                const pmID = createPassengerService(systemID);
                createBillingService(systemID);
                const tmID = createTripManagementService(systemID);
                const pwID = createPassengerWebUI(systemID);
                const dwID = createDriverWebUI(systemID);
                const dmID = createDriverManagement(systemID);
                const pID = createPaymentService(systemID);
                const nID = createNotificationSerivce(systemID);
                const sPID = scenarioPaymentMethod(systemID);
                const sTID = scenarioBetterTrio(systemID);
                const sDID = scenarioDesignUserFriendly(systemID);
                const sNID = scenarioNotifications(systemID);
                const sVID = scenarioValidation(systemID);
                const sDatabaseID = scenarioDatabase(systemID);
                changeBitcoin(sPID, pID, pmID, dmID, nID, pwID, dwID);
                changeEthereum(sPID, pID, pmID, dmID, nID, pwID, dwID);
                changeGiroPay(sPID, pID, pmID, dmID, nID, pwID, dwID);
                changeAlgorithm(sTID, tmID);
                changeAPI(sTID, tmID);
                changeWebFramework(sDID, pwID);
                changeReimplementPUI(sDID, pwID);
                changeReimplementDUI(sDID, dwID);
                changeNotificationDRated(sNID, nID, dmID, dwID, pmID, pwID);
                changeNotificationDArrived(sNID, nID, dmID, dwID, pmID, pwID);
                changeValidation(sVID, systemID, pwID, dwID);
                changeDatabaseP(sDatabaseID, pmID, pwID);
                changeDatabaseD(sDatabaseID, dmID, dwID);
            }
        }
    });
});

// create new system
router.post("/systems", (req: Request, res: Response) => {
    System.findOne({ name: req.body.system.name }).then(system => {
        if (system) {
            res.json({ message: "System name already exists." });
            res.status(400);
        } else {
            const data = new System(req.body.system);
            data.save(e => {
                if (e) {
                    return console.error(e);
                }
            });
            for (let i = 0; i < req.body.services.valueOf().length; i++) {
                if (req.body.services[i].system === undefined) {
                    req.body.services[i].system = { _id: "" } as ISystem;
                }
                req.body.services[i].system._id = data._id;
                const service = new Service(req.body.services[i]);
                service.save(e => {
                    if (e) {
                        return console.error(e);
                    }
                });
            }
            res.json({
                _id: data._id,
                message: "System successfully created."
            });
        }
    });
});

// get all systems
router.get("/systems", (req: Request, res: Response) => {
    Promise.all([
        System.find({}).exec(),
        Service.find().exec(),
        Scenario.find().exec()
    ]).then(results => {
        // If no systems exist, just return an empty array
        if (results[0].length === 0) {
            return res.json([]);
        }

        // Otherwise, attach all services and scenarios for each system
        results[0].forEach((system: any) => {
            system.services = results[1].filter(
                (service: any) =>
                    String(service.system._id) === String(system._id)
            );
            system.scenarios = results[2].filter(
                (scenario: any) =>
                    String(scenario.system._id) === String(system._id)
            );
        });

        res.json(results[0]);
    });
});

// get a system by id
router.get("/systems/:id", (req: Request, res: Response) => {
    Promise.all([
        System.findById(req.params.id).exec(),
        Service.find({ system: req.params.id }).exec(),
        Scenario.find({ system: req.params.id }).exec()
    ]).then(results => {
        // If the system does not exist, return 404
        if (results[0] === undefined) {
            // res.status(404);
            return res.json({ message: "System not found." });
        }

        // Otherwise, attach all services and scenarios of the system
        (results[0] as any).services = results[1];
        (results[0] as any).scenarios = results[2];

        res.json(results[0]);
    });
});

// update a system
router.put("/systems/:id", (req: Request, res: Response) => {
    // first get the old system for later purposes
    System.findOne({ _id: req.body.system._id }).then(oldSystemDoc => {
        const oldSystem = oldSystemDoc.toJSON();
        // first add new services to the database
        for (let i = 0; i < req.body.system.services.valueOf().length; i++) {
            if (req.body.system.services[i].system === undefined) {
                req.body.system.services[i].system = {
                    _id: req.body.system._id
                } as ISystem;
            }
            // check if the service has an ID, if it is undefined then it is not in the database
            if (req.body.system.services[i]._id === undefined) {
                req.body.system.services[i].system._id = req.params.id;
                const service = new Service(req.body.system.services[i]);
                service.save(e => {
                    if (e) {
                        return console.error(e);
                    }
                });
                req.body.system.services[i] = service.toJSON();
            }
        }

        System.updateOne({ _id: req.params.id }, req.body.system).then(() => {
            // go through the old system and search for different services
            oldSystem.services.forEach(oldService => {
                const index = req.body.system.services.findIndex(service => {
                    return service._id.toString() === oldService.toString();
                });
                // if a old service is not in the new services then check if it already exists.
                // If it exist delete it and if it don´t exist then create a new one
                if (index === -1) {
                    Service.findById(oldService.toString())
                        .populate({
                            path: "system",
                            select: "_id name description"
                        })
                        .then(service => {
                            if (service) {
                                // delete all changes and the service if it exists
                                Change.deleteMany({
                                    service: oldService.toString()
                                }).then(() => {
                                    Service.deleteOne({
                                        _id: oldService.toString()
                                    }).then(() => {
                                        //
                                    });
                                });
                                // search in ripples for the service and update the change with the updated ripples
                                Change.find().then(changes => {
                                    changes.forEach(change => {
                                        const changeJSon = change.toJSON();
                                        const indexRipple = changeJSon.ripples.findIndex(
                                            ripple => {
                                                return (
                                                    ripple.toString() ===
                                                    service._id.toString()
                                                );
                                            }
                                        );
                                        // edit the change by removing the found service in the ripples
                                        if (indexRipple !== -1) {
                                            changeJSon.ripples.splice(
                                                indexRipple,
                                                1
                                            );
                                            Change.updateOne(
                                                { _id: changeJSon._id },
                                                changeJSon
                                            ).then(() => {
                                                //
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    // if service is in the old system and the new system then update it
                } else {
                    Service.updateOne(
                        { _id: req.body.system.services[index]._id },
                        req.body.system.services[index]
                    ).then(() => {
                        //
                    });
                }
            });
            res.json({ message: "System successfully updated" });
        });
    });
});

// delete a single system and all services, scenarios, and changes belonging to it
router.delete("/systems/:id", (req: Request, res: Response) => {
    Service.find({ system: req.params.id }).then(services => {
        if (services) {
            services.forEach(service => {
                Change.deleteMany({ service: service._id }).then(() => {
                    Service.deleteOne({ _id: service._id }).then(() => {
                        //
                    });
                });
            });
        }
        Scenario.deleteMany({ system: req.params.id }).then(() => {
            System.deleteOne({ _id: req.params.id }).then(() => {
                //
            });
        });
    });
    res.json({
        message: "System and associated entities successfully deleted."
    });
});

export { router };

