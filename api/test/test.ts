import { ObjectID } from "bson";
import { expect } from "chai";
import MongoMemoryServer from "mongodb-memory-server";
import { findCriticalService, getEffort, getTotalAffectedServices } from "../src/evaluation";

process.env.DB_HOST = process.env.DB_HOST || "localhost:27017";
process.env.DB_NAME = process.env.DB_NAME || "sbs-evaluation";

let mongod;

const services = [
    {
        _id: new ObjectID("5cfd6e34829f38340c5232ae"),
        associations: ["Payments"],
        description: "It manage the passengers.",
        name: "Passenger management",
        system: new ObjectID("5cfd6e34829f38340c5232ad")
    },
    {
        _id: new ObjectID("5cfd6e34829f38340c5232af"),
        associations: [],
        description: "It manages the billings. Every Trip has a billing.",
        name: "Billing",
        system: new ObjectID("5cfd6e34829f38340c5232ad")
    },
    {
        _id: new ObjectID("5cfd6e34829f38340c5232b1"),
        associations: ["Passenger management", "Driver management"],
        description:
            "A passenger can book here his trip and get notifications.",
        name: "Passenger Web UI",
        system: new ObjectID("5cfd6e34829f38340c5232ad")
    },
    {
        _id: new ObjectID("5cfd6e34829f38340c5232b0"),
        associations: ["Billing"],
        description:
            "It manage the route from the location of a passenger to his destination.",
        name: "Trip management",
        system: new ObjectID("5cfd6e34829f38340c5232ad")
    },
    {
        _id: new ObjectID("5cfd6e34829f38340c5232b2"),
        associations: ["Driver management"],
        description: "A driver can accept here the trip of a passenger.",
        name: "Driver Web UI",
        system: new ObjectID("5cfd6e34829f38340c5232ad")
    },
    {
        _id: new ObjectID("5cfd6e34829f38340c5232b4"),
        associations: [],
        description: "Through this service all payments will be done.",
        name: "Payments",
        system: new ObjectID("5cfd6e34829f38340c5232ad")
    },
    {
        _id: new ObjectID("5cfd6e34829f38340c5232b5"),
        associations: [],
        description: "It sends notifications to drivers and passengers.",
        name: "Notification",
        system: new ObjectID("5cfd6e34829f38340c5232ad")
    },
    {
        _id: new ObjectID("5cfd6e34829f38340c5232b3"),
        associations: ["Payments", "Notification"],
        description: "It manage the drivers.",
        name: "Driver management",
        system: new ObjectID("5cfd6e34829f38340c5232ad")
    },
    {
        _id: new ObjectID("5cfd6e34829f38340c5232c6"),
        associations: [],
        description: "It validates the user input",
        name: "[new addition] Validation",
        system: new ObjectID("5cfd6e34829f38340c5232ad")
    }
];

const system = {
    _id: new ObjectID("5cfd6e34829f38340c5232ad"),
    services
};

const scenariosSystem = [
    {
        _id: new ObjectID("5cfd6e34829f38340c5232b6"),
        category: "Market driven",
        changes: [
            {
                _id: new ObjectID("5cfd6e34829f38340c5232bc"),
                cosmicType: "Entry",
                description: "Add Bitcoin",
                effortCodeNew: 69,
                effortCosmicFunctionPoints: 20,
                effortHours: 49,
                effortOrdinal: 4,
                effortStoryPoints: 20,
                ripples: [
                    new ObjectID("5cfd6e34829f38340c5232ae"),
                    new ObjectID("5cfd6e34829f38340c5232b3"),
                    new ObjectID("5cfd6e34829f38340c5232b5"),
                    new ObjectID("5cfd6e34829f38340c5232b1"),
                    new ObjectID("5cfd6e34829f38340c5232b2")
                ],
                scenario: {
                    _id: new ObjectID("5cfd6e34829f38340c5232b6"),
                    description:
                        "Adds new payment methods to the payment service",
                    name: "Add new payment methods",
                    system: new ObjectID("5cfd6e34829f38340c5232ad")
                },
                service: new ObjectID("5cfd6e34829f38340c5232b4"),
                type: "modification"
            },
            {
                _id: new ObjectID("5cfd6e34829f38340c5232be"),
                cosmicType: "Entry",
                description: "Add GiroPay",
                effortCodeNew: 28,
                effortCosmicFunctionPoints: 10,
                effortHours: 20,
                effortOrdinal: 3,
                effortStoryPoints: 8,
                ripples: [
                    new ObjectID("5cfd6e34829f38340c5232ae"),
                    new ObjectID("5cfd6e34829f38340c5232b3"),
                    new ObjectID("5cfd6e34829f38340c5232b5"),
                    new ObjectID("5cfd6e34829f38340c5232b1"),
                    new ObjectID("5cfd6e34829f38340c5232b2")
                ],
                scenario: {
                    _id: new ObjectID("5cfd6e34829f38340c5232b6"),
                    description:
                        "Adds new payment methods to the payment service",
                    name: "Add new payment methods",
                    system: new ObjectID("5cfd6e34829f38340c5232ad")
                },
                service: new ObjectID("5cfd6e34829f38340c5232b4"),
                type: "modification"
            },
            {
                _id: new ObjectID("5cfd6e34829f38340c5232bd"),
                cosmicType: "Entry",
                description: "Add Ethereum",
                effortCodeNew: 69,
                effortCosmicFunctionPoints: 20,
                effortHours: 49,
                effortOrdinal: 4,
                effortStoryPoints: 20,
                ripples: [
                    new ObjectID("5cfd6e34829f38340c5232ae"),
                    new ObjectID("5cfd6e34829f38340c5232b3"),
                    new ObjectID("5cfd6e34829f38340c5232b5"),
                    new ObjectID("5cfd6e34829f38340c5232b1"),
                    new ObjectID("5cfd6e34829f38340c5232b2")
                ],
                scenario: {
                    _id: new ObjectID("5cfd6e34829f38340c5232b6"),
                    description:
                        "Adds new payment methods to the payment service",
                    name: "Add new payment methods",
                    system: new ObjectID("5cfd6e34829f38340c5232ad")
                },
                service: new ObjectID("5cfd6e34829f38340c5232b4"),
                type: "modification"
            }
        ],
        description: "Adds new payment methods to the payment service",
        name: "Add new payment methods",
        scenarioEffortCosmic: 50,
        scenarioEffortHours: 118,
        scenarioEffortOrdinal: 3.67,
        scenarioEffortStoryPoints: 48,
        scenarioMaintenanceEffort: 166,
        system: new ObjectID("5cfd6e34829f38340c5232ad"),
        tags: ["Market driven"]
    },
    {
        _id: new ObjectID("5cfd6e34829f38340c5232b9"),
        category: "User interface overhaul",
        changes: [
            {
                _id: new ObjectID("5cfd6e34829f38340c5232c4"),
                cosmicType: "Exit",
                description: "Notification when driver is rated",
                effortCodeNew: 112,
                effortCosmicFunctionPoints: 8,
                effortHours: 80,
                effortOrdinal: 3,
                effortStoryPoints: 8,
                ripples: [
                    new ObjectID("5cfd6e34829f38340c5232b3"),
                    new ObjectID("5cfd6e34829f38340c5232b2"),
                    new ObjectID("5cfd6e34829f38340c5232ae"),
                    new ObjectID("5cfd6e34829f38340c5232b1")
                ],
                scenario: {
                    _id: new ObjectID("5cfd6e34829f38340c5232b9"),
                    description: "For more feedback we need more notifications",
                    name: "More notifications",
                    system: new ObjectID("5cfd6e34829f38340c5232ad")
                },
                service: new ObjectID("5cfd6e34829f38340c5232b5"),
                type: "modification"
            },
            {
                _id: new ObjectID("5cfd6e34829f38340c5232c5"),
                cosmicType: "Exit",
                description: "Notification when driver has arrived",
                effortCodeNew: 84,
                effortCosmicFunctionPoints: 8,
                effortHours: 60,
                effortOrdinal: 3,
                effortStoryPoints: 8,
                ripples: [
                    new ObjectID("5cfd6e34829f38340c5232b3"),
                    new ObjectID("5cfd6e34829f38340c5232b2"),
                    new ObjectID("5cfd6e34829f38340c5232ae"),
                    new ObjectID("5cfd6e34829f38340c5232b1")
                ],
                scenario: {
                    _id: new ObjectID("5cfd6e34829f38340c5232b9"),
                    description: "For more feedback we need more notifications",
                    name: "More notifications",
                    system: new ObjectID("5cfd6e34829f38340c5232ad")
                },
                service: new ObjectID("5cfd6e34829f38340c5232b5"),
                type: "modification"
            }
        ],
        description: "For more feedback we need more notifications",
        name: "More notifications",
        system,
        scenarioEffortCosmic: 16,
        scenarioEffortHours: 140,
        scenarioEffortOrdinal: 3,
        scenarioEffortStoryPoints: 16,
        scenarioMaintenanceEffort: 196,
        tags: ["User interface overhaul"]
    },
    {
        _id: new ObjectID("5cfd6e34829f38340c5232b7"),
        category: "Algorithm change",
        changes: [
            {
                _id: new ObjectID("5cfd6e34829f38340c5232bf"),
                cosmicType: "Write",
                description: "Change algorithm",
                effortCodeNew: 280,
                effortCosmicFunctionPoints: 55,
                effortHours: 200,
                effortOrdinal: 7,
                effortStoryPoints: 40,
                ripples: [],
                scenario: {
                    _id: new ObjectID("5cfd6e34829f38340c5232b7"),
                    description:
                        "Change the algorithm and some of the used APIs for faster trip calculation",
                    name: "Better trip calculation",
                    system: new ObjectID("5cfd6e34829f38340c5232ad")
                },
                service: new ObjectID("5cfd6e34829f38340c5232b0"),
                type: "modification"
            },
            {
                _id: new ObjectID("5cfd6e34829f38340c5232c0"),
                cosmicType: "Read",
                description: "Use other APIs",
                effortCodeNew: 112,
                effortCosmicFunctionPoints: 18,
                effortHours: 80,
                effortOrdinal: 4,
                effortStoryPoints: 13,
                ripples: [],
                scenario: {
                    _id: new ObjectID("5cfd6e34829f38340c5232b7"),
                    description:
                        "Change the algorithm and some of the used APIs for faster trip calculation",
                    name: "Better trip calculation",
                    system: new ObjectID("5cfd6e34829f38340c5232ad")
                },
                service: new ObjectID("5cfd6e34829f38340c5232b0"),
                type: "modification"
            }
        ],
        description:
            "Change the algorithm and some of the used APIs for faster trip calculation",
        name: "Better trip calculation",
        system,
        scenarioEffortCosmic: 73,
        scenarioEffortHours: 280,
        scenarioEffortOrdinal: 5.5,
        scenarioEffortStoryPoints: 53,
        scenarioMaintenanceEffort: 392,
        tags: ["Algorithm change"]
    },
    {
        _id: new ObjectID("5cfd6e34829f38340c5232ba"),
        category: "Safety",
        changes: [
            {
                _id: new ObjectID("5cfd6e34829f38340c5232c7"),
                cosmicType: "Entry",
                description: "It validates the user input",
                effortCodeNew: 1680,
                effortCosmicFunctionPoints: 100,
                effortHours: 1200,
                effortOrdinal: 8,
                effortStoryPoints: 100,
                ripples: [
                    new ObjectID("5cfd6e34829f38340c5232b1"),
                    new ObjectID("5cfd6e34829f38340c5232b2")
                ],
                scenario: {
                    _id: new ObjectID("5cfd6e34829f38340c5232ba"),
                    description:
                        "To validate user inputs a new validation service will be created",
                    name: "Add a validation for user input",
                    system: new ObjectID("5cfd6e34829f38340c5232ad")
                },
                service: new ObjectID("5cfd6e34829f38340c5232c6"),
                type: "addition"
            }
        ],
        description:
            "To validate user inputs a new validation service will be created",
        name: "Add a validation for user input",
        system,
        scenarioEffortCosmic: 100,
        scenarioEffortHours: 1200,
        scenarioEffortOrdinal: 8,
        scenarioEffortStoryPoints: 100,
        scenarioMaintenanceEffort: 1680,
        tags: ["Safety"]
    },
    {
        _id: new ObjectID("5cfd6e34829f38340c5232b8"),
        category: "User interface overhaul",
        changes: [
            {
                _id: new ObjectID("5cfd6e34829f38340c5232c1"),
                cosmicType: "Entry",
                description: "Change Web Framework",
                effortCodeNew: 2800,
                effortCosmicFunctionPoints: 80,
                effortHours: 2000,
                effortOrdinal: 9,
                effortStoryPoints: 100,
                ripples: [],
                scenario: {
                    _id: new ObjectID("5cfd6e34829f38340c5232b8"),
                    description:
                        "Major redesign and implementation of the user interfaces for driver and passenger",
                    name: "Design and implement more user-friendly UI",
                    system: new ObjectID("5cfd6e34829f38340c5232ad")
                },
                service: new ObjectID("5cfd6e34829f38340c5232b1"),
                type: "modification"
            },
            {
                _id: new ObjectID("5cfd6e34829f38340c5232c3"),
                cosmicType: "Entry",
                description: "Reimplement the Web UI for drivers",
                effortCodeNew: 1120,
                effortCosmicFunctionPoints: 65,
                effortHours: 800,
                effortOrdinal: 6,
                effortStoryPoints: 100,
                ripples: [],
                scenario: {
                    _id: new ObjectID("5cfd6e34829f38340c5232b8"),
                    description:
                        "Major redesign and implementation of the user interfaces for driver and passenger",
                    name: "Design and implement more user-friendly UI",
                    system: new ObjectID("5cfd6e34829f38340c5232ad")
                },
                service: new ObjectID("5cfd6e34829f38340c5232b2"),
                type: "modification"
            },
            {
                _id: new ObjectID("5cfd6e34829f38340c5232c2"),
                cosmicType: "Entry",
                description: "Reimplement the Web UI for passengers",
                effortCodeNew: 1120,
                effortCosmicFunctionPoints: 65,
                effortHours: 800,
                effortOrdinal: 6,
                effortStoryPoints: 100,
                ripples: [],
                scenario: {
                    _id: new ObjectID("5cfd6e34829f38340c5232b8"),
                    description:
                        "Major redesign and implementation of the user interfaces for driver and passenger",
                    name: "Design and implement more user-friendly UI",
                    system: new ObjectID("5cfd6e34829f38340c5232ad")
                },
                service: new ObjectID("5cfd6e34829f38340c5232b1"),
                type: "modification"
            }
        ],
        description:
            "Major redesign and implementation of the user interfaces for driver and passenger",
        name: "Design and implement more user-friendly UI",
        scenarioEffortCosmic: 210,
        scenarioEffortHours: 3600,
        scenarioEffortOrdinal: 7,
        scenarioEffortStoryPoints: 300,
        system,
        scenarioMaintenanceEffort: 5040,
        tags: ["User interface overhaul"]
    },
    {
        _id: new ObjectID("5cfd6e34829f38340c5232bb"),
        category: "New database management system",
        changes: [
            {
                _id: new ObjectID("5cfd6e34829f38340c5232c9"),
                cosmicType: "Write",
                description: "Change the database in the driver management.",
                effortCodeNew: 224,
                effortCosmicFunctionPoints: 25,
                effortHours: 160,
                effortOrdinal: 1,
                effortStoryPoints: 20,
                ripples: [new ObjectID("5cfd6e34829f38340c5232b2")],
                scenario: {
                    _id: new ObjectID("5cfd6e34829f38340c5232bb"),
                    description:
                        "Because another database model will improve the performance, the database will be changed",
                    name: "Change database for persistent data",
                    system: new ObjectID("5cfd6e34829f38340c5232ad")
                },
                service: new ObjectID("5cfd6e34829f38340c5232b3"),
                type: "modification"
            },
            {
                _id: new ObjectID("5cfd6e34829f38340c5232c8"),
                cosmicType: "Write",
                description: "Change the database in passenger management.",
                effortCodeNew: 224,
                effortCosmicFunctionPoints: 23,
                effortHours: 160,
                effortOrdinal: 5,
                effortStoryPoints: 20,
                ripples: [new ObjectID("5cfd6e34829f38340c5232b1")],
                scenario: {
                    _id: new ObjectID("5cfd6e34829f38340c5232bb"),
                    description:
                        "Because another database model will improve the performance, the database will be changed",
                    name: "Change database for persistent data",
                    system: new ObjectID("5cfd6e34829f38340c5232ad")
                },
                service: new ObjectID("5cfd6e34829f38340c5232ae"),
                type: "modification"
            }
        ],
        description:
            "Because another database model will improve the performance, the database will be changed",
        name: "Change database for persistent data",
        scenarioEffortCosmic: 48,
        scenarioEffortHours: 320,
        scenarioEffortOrdinal: 3,
        scenarioEffortStoryPoints: 40,
        system,
        scenarioMaintenanceEffort: 448,
        tags: ["New database management system"]
    }
];

const testSystem = {
    _id: new ObjectID("5cfd6e34829f38340c5232ad"),
    services,
    scenarios: scenariosSystem
};

describe("Evaluation Test", () => {
    before(() => {
        mongod = new MongoMemoryServer({
            instance: {
                dbName: process.env.DB_NAME, // by default generate random dbName
                ip: "mongodb://localhost",
                port: 27017
            }
        });
    });

    after(() => {
        mongod.stop();
    });

    it("should return most critical service with highest overall effort which is Passenger Web UI", () => {
        return expect(findCriticalService(services, testSystem))
            .to.have.property("criticalServiceNumber")
            .equals(9);
    });

    it("should return total effort 5658 hours", () => {
        return expect(getEffort(testSystem, scenariosSystem))
            .to.have.property("effortHours")
            .equals(5658);
    });

    it("should return total affected services", () => {
        const changes = [];
        scenariosSystem.forEach(scenario => {
            scenario.changes.forEach(change => {
                changes.push(change);
            });
        });
        return expect(
            getTotalAffectedServices(testSystem, scenariosSystem, changes)
        )
            .to.have.property("servicesAffected")
            .equals(9);
    });
});
