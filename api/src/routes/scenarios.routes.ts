import { Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import Change from "../models/Change";
import Scenario from "../models/Scenario";
import Service from "../models/Service";

const router: Router = Router();

mongoose.connect(`mongodb://${process.env.DB_HOST}`, {
    useNewUrlParser: true,
    dbName: process.env.DB_NAME
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// create new scenario
router.post("/scenarios", (req: Request, res: Response) => {
    Scenario.findOne({
        name: req.body.scenario.name,
        system: req.body.scenario.system
    }).then(scenario => {
        if (scenario) {
            res.json({
                message: "Scenario name already exists for this system."
            });
            res.status(400);
        } else {
            const data = new Scenario(req.body.scenario);
            data.save(e => {
                if (e) {
                    return console.error(e);
                }
            });
            for (let i = 0; i < req.body.changes.valueOf().length; i++) {
                req.body.changes[i].scenario._id = data._id;
                const change = new Change(req.body.changes[i]);
                change.save(error => {
                    if (error) {
                        return console.error(error);
                    }
                });
            }
            res.json({
                message: "Scenario successfully created.",
                scenario: data
            });
        }
    });
});

// get all scenarios, potentially of a single system
router.get("/scenarios", (req: Request, res: Response) => {
    const query = req.query.systemId ? { system: req.query.systemId } : {};
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

            // find out hardest change by sorting, use concat() to avoid mutating the original array
            scenario.hardestChange = scenario.changes
                .concat()
                .sort((a, b) => b.effort - a.effort)[0];

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

            scenario.scenarioEffortOrdinal =
                Math.round(effortOrdinal * 100) / 100;
            scenario.scenarioMaintenanceEffort = Math.round(effortNewCode);
            scenario.scenarioEffortHours = effortHours;
            scenario.scenarioEffortCosmic = effortCosmic;
            scenario.scenarioEffortStoryPoints = effortStoryPoints;
        });

        res.json(results[0]);
    });
});

// get a scenario by id
router.get("/scenarios/:id", (req: Request, res: Response) => {
    Promise.all([
        Scenario.findById(req.params.id)
            .populate({ path: "system", select: "_id name" })
            .exec(),
        Change.find({ scenario: req.params.id }).exec()
    ]).then(results => {
        // if the scenario does not exist, return 404
        if (results[0] === undefined) {
            // res.status(404);
            return res.json({ message: "Scenario not found." });
        }

        // otherwise, attach all changes of the scenario
        (results[0] as any).changes = results[1];
        res.json(results[0]);
    });
});

// get scenario by id
router.get("/scenario/:id", (req: Request, res: Response) => {
    Scenario.findById(req.params.id).then(scenario => {
        res.json(scenario);
    });
});

// update a scenario
router.put("/scenarios/:id", (req: Request, res: Response) => {
    // for updating delete all changes and update the scenario
    Change.find({ scenario: req.params.id }).then(changes => {
        changes.forEach(change => {
            Change.deleteOne({ _id: change._id }).then(() => {
                //
            });
        });
    });
    Scenario.updateOne({ _id: req.params.id }, req.body.scenario).then(() => {
        for (let i = 0; i < req.body.changes.valueOf().length; i++) {
            req.body.changes[i].scenario._id = req.body.scenario._id;
            const change = new Change(req.body.changes[i]);
            change.save(error => {
                if (error) {
                    return console.error(error);
                }
            });
        }
        res.json({
            message: "Scenario successfully updated.",
            scenario: req.body.scenario
        });
    });
});

// delete a scenario
router.delete("/scenarios/:id", (req: Request, res: Response) => {
    Change.find({ scenario: req.params.id }).then(changes => {
        changes.forEach(change => {
            // delete the new services in the scenario
            const changeJSON = change.toJSON();
            Service.findById(changeJSON.service).then(service => {
                const serviceJSON = service.toJSON();
                if (serviceJSON.name.includes("[new addition]")) {
                    Service.deleteOne({ _id: serviceJSON._id }).then(() => {
                        //
                    });
                }
            });
            // delete the change
            Change.deleteOne({ _id: change._id }).then(() => {
                //
            });
        });
    });
    Scenario.deleteOne({ _id: req.params.id }).then(() => {
        res.json({
            message: "Scenario and associated entities successfully deleted."
        });
    });
});

export { router };

