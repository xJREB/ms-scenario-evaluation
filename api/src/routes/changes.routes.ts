import { Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import { IChange, IService } from "../interfaces";
import Change from "../models/Change";
import Service from "../models/Service";

const router: Router = Router();

// mongo stuff
mongoose.connect(`mongodb://${process.env.DB_HOST}`, {
    useNewUrlParser: true,
    dbName: process.env.DB_NAME
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// create change
router.post("/changes", async (req: Request, res: Response) => {
    // cleaning up "empty" ripples
    req.body.ripples = req.body.ripples || [];
    if (req.body.ripples.length > 0) {
        req.body.ripples = req.body.ripples.filter(
            (ripple: string) => ripple !== ""
        );
    }

    const result = await Change.findOne({
        scenario: req.body.scenario,
        service: req.body.service
    });

    const change = new Change(req.body);
    change.save(error => {
        if (error) {
            return console.error(error);
        }
        if (result) {
            res.json({
                message:
                    "Change saved. However, this service already had a change."
            });
        } else {
            res.json({ message: "Change successfully created." });
        }
    });
});

// create changes
router.post("/allChanges", async (req: Request, res: Response) => {
    for (let i = 0; i < req.body.valueOf().length; i++) {
        const change = new Change(req.body[i]);
        change.save(error => {
            if (error) {
                return console.error(error);
            }
        });
    }
    res.json({ message: "Change successfully created." });
});

// get all changes, potentially of a single scenario
router.get("/changes", (req: Request, res: Response) => {
    const query = req.query.scenarioId
        ? { scenario: req.query.scenarioId }
        : {};
    Change.find(query)
        .populate({ path: "scenario", select: "_id name description system" })
        .then(changes => {
            res.json(changes);
        });
});

// get change by id
router.get("/changes/:id", (req: Request, res: Response) => {
    Change.findById(req.params.id).then(change => {
        if (change) {
            res.json(change);
        } else {
            res.json({ message: "Change not found." });
            res.status(404);
        }
    });
});

// update a change
router.put("/changes/:id", (req: Request, res: Response) => {
    Change.updateOne({ _id: req.params.id }, req.body).then(() => {
        res.json({ message: "Change successfully updated." });
    });
});

// delete a change
router.delete("/changes/:id", (req: Request, res: Response) => {
    Change.deleteOne({ _id: req.params.id }).then(() => {
        res.json({ message: "Change successfully deleted." });
    });
});

// reset changes
// in the webapp a user can manipulate the changes during the editing process of a scenario. This means he can
// add new services, which will be created in the database. Also new added services could be possibly deleted.
// If a user decides to reload the page or navigate to another route, then the manipulation needs to be reset
// in the database
router.post("/changes/reset", async (req: Request, res: Response) => {
    // set variables
    const actualChanges: IChange[] = req.body.actualChanges;
    const oldChanges: IChange[] = req.body.oldChanges;
    const oldChangesWithAddedService: IChange[] = [];
    // find the critical changes that add a new service
    oldChanges.forEach(oldChange => {
        if (oldChange.service.name.includes("[new addition]")) {
            oldChangesWithAddedService.push(oldChange);
        }
    });
    // go through all old changes that add a service and compare with the actual changes
    // if they contain the additional service
    oldChangesWithAddedService.forEach(oldChangesAddedService => {
        // search if the actual changes contain the old change with the new added service
        const index = actualChanges.findIndex(change => {
            if (change.service._id !== undefined && change.service._id !== "") {
                return (
                    change.service._id === oldChangesAddedService.service._id
                );
            }
        });
        // if the actual change don´t contain the old change with the new added service,
        // create the new added service and the change
        if (index === -1) {
            const oldServiceID = oldChangesAddedService.service._id;
            // prepare the data
            delete oldChangesAddedService.service._id;
            delete oldChangesAddedService._id;
            oldChangesAddedService.scenario = req.body.scenarioID;
            oldChangesAddedService.service = {
                description: "",
                name: oldChangesAddedService.service.name,
                system: req.body.systemID
            } as IService;
            // save the service
            const service = new Service(oldChangesAddedService.service);
            service.save(e => {
                if (e) {
                    return console.error(e);
                }
            });
            // save the change
            oldChangesAddedService.service = service._id;
            const change = new Change(oldChangesAddedService);
            change.save(error => {
                if (error) {
                    return console.error(error);
                }
            });
            // after the change is reseted then the ripple effect to other changes needs to be added
            oldChanges.forEach(oldChange => {
                for (let k = 0; k < oldChange.ripples.length; k++) {
                    let checkIfOneChange = false;
                    // check if the new added service was in one of the ripples
                    if (oldChange.ripples[k].toString() === oldServiceID) {
                        oldChange.ripples[k] = oldChangesAddedService.service;
                        checkIfOneChange = true;
                    }
                    // if it was then update the change where it was
                    if (checkIfOneChange) {
                        Change.updateOne(
                            { _id: oldChange._id },
                            oldChange
                        ).then(() => {
                            //
                        });
                    }
                }
            });
        }
    });
    res.json({ message: "Change successfully reset." });
});

export { router };

