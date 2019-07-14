import Change from "./models/Change";
import Scenario from "./models/Scenario";
import Service from "./models/Service";
import System from "./models/System";

export function createSystem() {
    const system = new System({
        description:
            "Uber is system that bring car drivers and passengers together. The passenger can book his destination and a driver can accept the order.",
        name: "Uber"
    });
    system.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    return system._id;
}

export function createPassengerService(systemID) {
    const passengerManagement = new Service({
        associations: ["Payments"],
        description: "It manage the passengers.",
        name: "Passenger management",
        system: systemID
    });
    passengerManagement.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    return passengerManagement._id;
}

export function createBillingService(systemID) {
    const billing = new Service({
        associations: [],
        description: "It manages the billings. Every Trip has a billing.",
        name: "Billing",
        system: systemID
    });
    billing.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    return billing._id;
}

export function createTripManagementService(systemID) {
    const tripManagement = new Service({
        associations: ["Billing"],
        description:
            "It manage the route from the location of a passenger to his destination.",
        name: "Trip management",
        system: systemID
    });
    tripManagement.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    return tripManagement._id;
}

export function createPassengerWebUI(systemID) {
    const passengerWebUI = new Service({
        associations: ["Passenger management", "Driver management"],
        description:
            "A passenger can book here his trip and get notifications.",
        name: "Passenger Web UI",
        system: systemID
    });
    passengerWebUI.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    return passengerWebUI._id;
}

export function createDriverWebUI(systemID) {
    const driverWebUI = new Service({
        associations: ["Driver management"],
        description: "A driver can accept here the trip of a passenger.",
        name: "Driver Web UI",
        system: systemID
    });
    driverWebUI.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    return driverWebUI._id;
}

export function createDriverManagement(systemID) {
    const driverManagement = new Service({
        associations: ["Payments", "Notification"],
        description: "It manage the drivers.",
        name: "Driver management",
        system: systemID
    });
    driverManagement.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    return driverManagement._id;
}

export function createPaymentService(systemID) {
    const payments = new Service({
        associations: [],
        description: "Through this service all payments will be done.",
        name: "Payments",
        system: systemID
    });
    payments.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    return payments._id;
}

export function createNotificationSerivce(systemID) {
    const notifications = new Service({
        associations: [],
        description: "It sends notifications to drivers and passengers.",
        name: "Notification",
        system: systemID
    });
    notifications.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    return notifications._id;
}

export function scenarioPaymentMethod(systemID) {
    const payment = new Scenario({
        category: "Market driven",
        description: "Adds new payment methods to the payment service",
        name: "Add new payment methods",
        scenarioEffortCosmic: 1,
        scenarioEffortHours: 1,
        scenarioEffortOrdinal: 1,
        scenarioEffortStoryPoints: 1,
        scenarioMaintenanceEffort: 1,
        system: systemID._id,
        tags: ["Market driven"]
    });
    payment.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    return payment._id;
}

export function scenarioBetterTrio(systemID) {
    const trip = new Scenario({
        category: "Algorithm change",
        description:
            "Change the algorithm and some of the used APIs for faster trip calculation",
        name: "Better trip calculation",
        scenarioEffortCosmic: 1,
        scenarioEffortHours: 1,
        scenarioEffortOrdinal: 1,
        scenarioEffortStoryPoints: 1,
        scenarioMaintenanceEffort: 1,
        system: systemID._id,
        tags: ["Algorithm change"]
    });
    trip.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    return trip._id;
}

export function scenarioDesignUserFriendly(systemID) {
    const design = new Scenario({
        category: "User interface overhaul",
        description:
            "Major redesign and implementation of the user interfaces for driver and passenger",
        name: "Design and implement more user-friendly UI",
        scenarioEffortCosmic: 1,
        scenarioEffortHours: 1,
        scenarioEffortOrdinal: 1,
        scenarioEffortStoryPoints: 1,
        scenarioMaintenanceEffort: 1,
        system: systemID._id,
        tags: ["User interface overhaul"]
    });
    design.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    return design._id;
}

export function scenarioNotifications(systemID) {
    const notifications = new Scenario({
        category: "User interface overhaul",
        description: "For more feedback we need more notifications",
        name: "More notifications",
        scenarioEffortCosmic: 1,
        scenarioEffortHours: 1,
        scenarioEffortOrdinal: 1,
        scenarioEffortStoryPoints: 1,
        scenarioMaintenanceEffort: 1,
        system: systemID._id,
        tags: ["User interface overhaul"]
    });
    notifications.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    return notifications._id;
}

export function scenarioValidation(systemID) {
    const validation = new Scenario({
        category: "Safety",
        description:
            "To validate user inputs a new validation service will be created",
        name: "Add a validation for user input",
        scenarioEffortCosmic: 1,
        scenarioEffortHours: 1,
        scenarioEffortOrdinal: 1,
        scenarioEffortStoryPoints: 1,
        scenarioMaintenanceEffort: 1,
        system: systemID._id,
        tags: ["Safety"]
    });
    validation.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    return validation._id;
}

export function scenarioDatabase(systemID) {
    const database = new Scenario({
        category: "New database management system",
        description:
            "Because another database model will improve the performance, the database will be changed",
        name: "Change database for persistent data",
        scenarioEffortCosmic: 1,
        scenarioEffortHours: 1,
        scenarioEffortOrdinal: 1,
        scenarioEffortStoryPoints: 1,
        scenarioMaintenanceEffort: 1,
        system: systemID._id,
        tags: ["New database management system"]
    });
    database.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    return database._id;
}

export function changeBitcoin(
    sPaymentID,
    paymentID,
    pmID,
    dmID,
    nID,
    pwID,
    dwID
) {
    const change = new Change({
        cosmicType: "Entry",
        description: "Add Bitcoin",
        effortCodeNew: 69,
        effortCosmicFunctionPoints: 20,
        effortHours: 49,
        effortOrdinal: 4,
        effortStoryPoints: 20,
        ripples: [pmID, dmID, nID, pwID, dwID],
        scenario: sPaymentID,
        service: paymentID,
        type: "modification"
    });
    change.save(e => {
        if (e) {
            return console.error(e);
        }
    });
}

export function changeEthereum(
    sPaymentID,
    paymentID,
    pmID,
    dmID,
    nID,
    pwID,
    dwID
) {
    const change = new Change({
        cosmicType: "Entry",
        description: "Add Ethereum",
        effortCodeNew: 69,
        effortCosmicFunctionPoints: 20,
        effortHours: 49,
        effortOrdinal: 4,
        effortStoryPoints: 20,
        ripples: [pmID, dmID, nID, pwID, dwID],
        scenario: sPaymentID,
        service: paymentID,
        type: "modification"
    });
    change.save(e => {
        if (e) {
            return console.error(e);
        }
    });
}

export function changeGiroPay(
    sPaymentID,
    paymentID,
    pmID,
    dmID,
    nID,
    pwID,
    dwID
) {
    const change = new Change({
        cosmicType: "Entry",
        description: "Add GiroPay",
        effortCodeNew: 28,
        effortCosmicFunctionPoints: 10,
        effortHours: 20,
        effortOrdinal: 3,
        effortStoryPoints: 8,
        ripples: [pmID, dmID, nID, pwID, dwID],
        scenario: sPaymentID,
        service: paymentID,
        type: "modification"
    });
    change.save(e => {
        if (e) {
            return console.error(e);
        }
    });
}

export function changeAlgorithm(sTripID, tmID) {
    const change = new Change({
        cosmicType: "Write",
        description: "Change algorithm",
        effortCodeNew: 280,
        effortCosmicFunctionPoints: 55,
        effortHours: 200,
        effortOrdinal: 7,
        effortStoryPoints: 40,
        ripples: [],
        scenario: sTripID,
        service: tmID,
        type: "modification"
    });
    change.save(e => {
        if (e) {
            return console.error(e);
        }
    });
}

export function changeAPI(sTripID, tmID) {
    const change = new Change({
        cosmicType: "Read",
        description: "Use other APIs",
        effortCodeNew: 112,
        effortCosmicFunctionPoints: 18,
        effortHours: 80,
        effortOrdinal: 4,
        effortStoryPoints: 13,
        ripples: [],
        scenario: sTripID,
        service: tmID,
        type: "modification"
    });
    change.save(e => {
        if (e) {
            return console.error(e);
        }
    });
}

export function changeWebFramework(sUserInterfaceID, userWebID) {
    const change = new Change({
        cosmicType: "Entry",
        description: "Change Web Framework",
        effortCodeNew: 2800,
        effortCosmicFunctionPoints: 80,
        effortHours: 2000,
        effortOrdinal: 9,
        effortStoryPoints: 100,
        ripples: [],
        scenario: sUserInterfaceID,
        service: userWebID,
        type: "modification"
    });
    change.save(e => {
        if (e) {
            return console.error(e);
        }
    });
}

export function changeReimplementPUI(sUserInterfaceID, userWebID) {
    const change = new Change({
        cosmicType: "Entry",
        description: "Reimplement the Web UI for passengers",
        effortCodeNew: 1120,
        effortCosmicFunctionPoints: 65,
        effortHours: 800,
        effortOrdinal: 6,
        effortStoryPoints: 100,
        ripples: [],
        scenario: sUserInterfaceID,
        service: userWebID,
        type: "modification"
    });
    change.save(e => {
        if (e) {
            return console.error(e);
        }
    });
}

export function changeReimplementDUI(sUserInterfaceID, driverWebID) {
    const change = new Change({
        cosmicType: "Entry",
        description: "Reimplement the Web UI for drivers",
        effortCodeNew: 1120,
        effortCosmicFunctionPoints: 65,
        effortHours: 800,
        effortOrdinal: 6,
        effortStoryPoints: 100,
        ripples: [],
        scenario: sUserInterfaceID,
        service: driverWebID,
        type: "modification"
    });
    change.save(e => {
        if (e) {
            return console.error(e);
        }
    });
}

export function changeNotificationDRated(
    sNotificationID,
    notificationID,
    dmID,
    dwID,
    pmID,
    pwID
) {
    const change = new Change({
        cosmicType: "Exit",
        description: "Notification when driver is rated",
        effortCodeNew: 112,
        effortCosmicFunctionPoints: 8,
        effortHours: 80,
        effortOrdinal: 3,
        effortStoryPoints: 8,
        ripples: [dmID, dwID, pmID, pwID],
        scenario: sNotificationID,
        service: notificationID,
        type: "modification"
    });
    change.save(e => {
        if (e) {
            return console.error(e);
        }
    });
}

export function changeNotificationDArrived(
    sNotificationID,
    notificationID,
    dmID,
    dwID,
    pmID,
    pwID
) {
    const change = new Change({
        cosmicType: "Exit",
        description: "Notification when driver has arrived",
        effortCodeNew: 84,
        effortCosmicFunctionPoints: 8,
        effortHours: 60,
        effortOrdinal: 3,
        effortStoryPoints: 8,
        ripples: [dmID, dwID, pmID, pwID],
        scenario: sNotificationID,
        service: notificationID,
        type: "modification"
    });
    change.save(e => {
        if (e) {
            return console.error(e);
        }
    });
}

export function changeValidation(sPaymentID, systemID, pwID, dwID) {
    const validation = new Service({
        description: "It validates the user input",
        name: "[new addition] Validation",
        system: systemID
    });
    validation.save(e => {
        if (e) {
            return console.error(e);
        }
    });
    const change = new Change({
        cosmicType: "Entry",
        description: "It validates the user input",
        effortCodeNew: 1680,
        effortCosmicFunctionPoints: 100,
        effortHours: 1200,
        effortOrdinal: 8,
        effortStoryPoints: 100,
        ripples: [pwID, dwID],
        scenario: sPaymentID,
        service: validation._id,
        type: "addition"
    });
    change.save(e => {
        if (e) {
            return console.error(e);
        }
    });
}

export function changeDatabaseP(sDatabaseID, pmID, pwID) {
    const change = new Change({
        cosmicType: "Write",
        description: "Change the database in passenger management.",
        effortCodeNew: 224,
        effortCosmicFunctionPoints: 23,
        effortHours: 160,
        effortOrdinal: 5,
        effortStoryPoints: 20,
        ripples: [pwID],
        scenario: sDatabaseID,
        service: pmID,
        type: "modification"
    });
    change.save(e => {
        if (e) {
            return console.error(e);
        }
    });
}

export function changeDatabaseD(sDatabaseID, dmID, dwID) {
    const change = new Change({
        cosmicType: "Write",
        description: "Change the database in the driver management.",
        effortCodeNew: 224,
        effortCosmicFunctionPoints: 25,
        effortHours: 160,
        effortOrdinal: 1,
        effortStoryPoints: 20,
        ripples: [dwID],
        scenario: sDatabaseID,
        service: dmID,
        type: "modification"
    });
    change.save(e => {
        if (e) {
            return console.error(e);
        }
    });
}
