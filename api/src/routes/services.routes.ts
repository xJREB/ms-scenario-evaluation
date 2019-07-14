import { Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import Change from "../models/Change";
import Service from "../models/Service";

const router: Router = Router();
mongoose.connect(`mongodb://${process.env.DB_HOST}`, {
    useNewUrlParser: true,
    dbName: process.env.DB_NAME
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// Create new service
router.post("/services", (req: Request, res: Response) => {
    const service = new Service(req.body);
    service.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    res.json({ message: "Service successfully created.", service });
});

// Get all services, potentially of a single system
router.get("/services", (req: Request, res: Response) => {
    const query = req.query.systemId ? { system: req.query.systemId } : {};
    Service.find(query)
        .populate({ path: "system", select: "_id name" })
        .then(services => {
            res.json(services);
        });
});

// Get a service by id
router.get("/services/:id", (req: Request, res: Response) => {
    Service.findById(req.params.id)
        .populate({ path: "system", select: "_id name description" })
        .then(service => {
            if (service) {
                res.json(service);
            } else {
                res.json({ message: "No service found." });
                res.status(404);
            }
        });
});

// Update a service
router.put("/services/:id", (req: Request, res: Response) => {
    Service.updateOne({ _id: req.params.id }, req.body).then(() => {
        Service.findById(req.params.id).then(service => {
            res.json({ service });
        });
    });
});

// Delete a service
router.delete("/services/:id", (req: Request, res: Response) => {
    // Delete all changes and the service if it exists
    Change.deleteMany({ service: req.params.id }).then(() => {
        Service.deleteOne({ _id: req.params.id }).then(() => {
            //
        });
    });
    // Search in ripples for the service and update the change with the updated ripples
    Change.find().then(changes => {
        changes.forEach(change => {
            const changeJSon = change.toJSON();
            const indexRipple = changeJSon.ripples.findIndex(ripple => {
                return ripple.toString() === req.params.id.toString();
            });
            // Edit the change by removing the found service in the ripples
            if (indexRipple !== -1) {
                changeJSon.ripples.splice(indexRipple, 1);
                Change.updateOne({ _id: changeJSon._id }, changeJSon).then(
                    () => {
                        //
                    }
                );
            }
        });
    });
    res.json({ message: "Service successfully updated" });
});

// Delete services that were created in the scenario as [new addition] when the page reloads or the user move without
// saving the scenario
router.delete("/services", (req: Request, res: Response) => {
    if (req.query.serviceIDs !== undefined) {
        req.query.serviceIDs.forEach(serviceID => {
            // Delete all changes and the service if it exists
            Change.deleteMany({ service: serviceID.toString() }).then(() => {
                Service.deleteOne({ _id: serviceID.toString() }).then(() => {
                    //
                });
            });
            // Search in ripples for the service and update the change with the updated ripples
            Change.find().then(changes => {
                changes.forEach(change => {
                    const changeJSon = change.toJSON();
                    const indexRipple = changeJSon.ripples.findIndex(ripple => {
                        return ripple.toString() === serviceID.toString();
                    });
                    // Edit the change by removing the found service in the ripples
                    if (indexRipple !== -1) {
                        changeJSon.ripples.splice(indexRipple, 1);
                        Change.updateOne(
                            { _id: changeJSon._id },
                            changeJSon
                        ).then(() => {
                            //
                        });
                    }
                });
            });
        });
        res.json({ message: "Services successfully deleted" });
    }
});

// @ts-ignore
export { router };

