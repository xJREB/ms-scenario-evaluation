/**
 * export all strings that the app need in german language
 */
export const StringsUtilEnglish = {
  /**
   * themes
   */
  themeDark: "Dark",
  themeLight: "Light",

  /**
   * ToolBar
   */
  toolbarDarkThemeSelector: "Dark theme",
  toolbarDesign1: "Hours",
  toolbarDesign2: "Ordinal Scale",
  toolbarDesign4: "Cosmic Function Points",
  toolbarDesign5: "Story Points",
  toolbarDialogClose: "close",
  toolbarLanguageEnglish: "English",
  toolbarLanguageGerman: "German",
  toolbarName: "Modifiability Scenario Creator",
  toolbarSelectLanguage: "Select language",

  /**
   * Account
   */
  accountEnglish: "English",
  accountGerman: "German",
  accountLanguage: "Language",

  /**
   * Overview
   */
  overviewEffortMethods: "Go to explanation",
  overviewFirstPoint: "Describe the system and its services that you want to analyze.",
  overviewFirstPointOne: "Go to 'create new system' or click on the button 'go to add system'.",
  overviewFirstPointThree: "Proceed to the next step of the process and describe the services of the system. " +
    "Keep in mind that a system has at least one service.",
  overviewFirstPointTwo: "Describe your system in the first step of the creating process.",
  overviewHowTo: "How To:",
  overviewSecondPoint: "Describe the scenarios you want to apply.",
  overviewSecondPointOne: "Go to 'create new scenario'.",
  overviewSecondPointThree: "Proceed to the next step of the process and describe the changes to the scenario. Each " +
    "change has a type that decides whether to delete an existing service, add a new service, " +
    "or change an existing service. " +
    "The affected service is the service to be modified or deleted. Ripples are all services that are caused " +
    "by the change of the affected service. Keep in mind that a scenario has at least one change.",
  overviewSecondPointTwo: "Describe a scenario in the first step of the build process. " +
    "A scenario in our context is a summary of all the changes that the scenario involves. " +
    "Tags can be applied to the scenario, but are not required. They help you to identify which tag has the highest " +
    "effort so you can see which tag the system is performing the worst when it changes.",
  overviewSystems: "Go to add System",
  overviewThirdPoint: "Evaluate your system in the 'Evaluation' tab.",

  /**
   * loading
   */
  loading: "Loading...",

  /**
   * System Overview
   */
  systemOverviewActions: "Actions",
  systemOverviewDeleteSystem: "System successfully deleted",
  systemOverviewDetails: "Details",
  systemOverviewName: "System",
  systemOverviewSearch: "Search",
  systemOverviewSearchNoResultPost: "found no results.",
  systemOverviewSearchNoResultPre: "Your search for ",
  systemOverviewServices: "Services",
  systemOverviewToAdding: "Add System",

  /**
   * Add System
   */
  addSystemBackButton: "Back",
  addSystemContinueButton: "Continue",
  addSystemSaveButton: "Save System",
  addSystemStepOne: "Add System",
  addSystemStepTwo: "Add Services",
  addSystemSuccess: "Successful created a system",
  addSystemSystemDescription: "System description: ",
  addSystemSystemDescriptionPlaceholder: "Enter a short description",
  addSystemSystemName: "System name:",
  addSystemSystemNamePlaceholder: "Enter the name",

  /**
   * add service
   */
  addServiceAbort: "Abort",
  addServiceAssociates: "Dependent services: ",
  addServiceAssociatesAdvice: "Here you can select associated services, " +
    "that will later help you to identify ripple effects.\n " +
    "When you add an associated service here the current service will automatically be added in the selected services.",
  addServiceNewServiceButton: "New service",
  addServiceSaveButton: "Save",
  addServiceServiceDescription: "Service description: ",
  addServiceServiceDescriptionPlaceholder: "Enter a short description",
  addServiceServiceName: "Service name:",
  addServiceServiceNamePlaceholder: "Enter the name",

  /**
   * error messages
   */
  ruleFieldNotEmpty: "Field should´t be empty",
  ruleFillAllFieldsCorrect: "Fill out all fields correctly",
  ruleScenarioRequireChange: "A Scenario need at least one change",
  ruleSystemRequireService: "A System need at least one service",

  /**
   * scenario overview
   */
  scenarioOverviewActions: "Actions",
  scenarioOverviewCategory: "Tags",
  scenarioOverviewChanges: "# of Changes",
  scenarioOverviewDetails: "Details",
  scenarioOverviewName: "Name",
  scenarioOverviewSuccessDelete: "Scenario successful deleted",
  scenarioOverviewSystem: "System",
  scenarioOverviewToAddScenario: "Add Scenario",

  /**
   * add scenario
   */
  addScenarioHeader: "Add Scenario",
  addScenarioSaveButton: "Save Scenario",
  addScenarioScenarioCategory: "Select tags that matches the scenario or leave it empty:",
  addScenarioScenarioDescription: "Briefly describe the scenario:",
  addScenarioScenarioName: "Scenario name:",
  addScenarioStepTwo: "Add Changes",
  addScenarioSystem: "System:",
  addScenarioSystemPlaceholder: "Search for your system",

  /**
   * add changes
   */
  addChangeAffectedServiceDescription: "This is the service that is affected by the change.",
  addChangeComplexityLabel: "Choose project complexity",
  addChangeCosmicEntry: "Entry",
  addChangeCosmicExit: "Exit",
  addChangeCosmicRead: "Read",
  addChangeCosmicTypeDescription: "An Entry is a data movement type that moves a data group from a functional " +
    "user across the boundary into the functional process where it is required. \n" +
    "An Exit is a data movement type that moves a data group from a functional process across the boundary " +
    "to the functional user that requires it. \n" +
    "A Read is a data movement type that moves a data group from persistent storage within reach of the " +
    "functional process which requires it. \n" +
    "A Write is a data movement type that moves a data group lying inside a functional process to persistent storage.",
  addChangeCosmicWrite: "Write",
  addChangeEffortCodeModified: "Modified code lines:",
  addChangeEffortCodeNew: "Lines of Code that change or is added:",
  addChangeEffortCodePlugin: "New plugin code lines:",
  addChangeEffortCosmicPoints: "Cosmic function points:",
  addChangeEffortCosmicPointsLabel: "Cosmic function points",
  addChangeEffortCosmicType: "Cosmic Type:",
  addChangeEffortH: "Effort in hours:",
  addChangeEffortHPlaceholder: "Enter hours",
  addChangeEffortOrdinal: "Effort how hard the change is:",
  addChangeEffortStoryPoints: "Story points:",
  addChangeEffortStoryPointsLabel: "Story points",
  addChangeEmbeddedMode: "Embedded Mode",
  addChangeLabelAffectedService: "Affected Service: ",
  addChangeLabelDescription: "Description: ",
  addChangeLabelEffort: "Effort: ",
  addChangeLabelRipple: "Ripple Effects: ",
  addChangeLabelType: "Type: ",
  addChangeOrganicMode: "Organic Mode",
  addChangePotentialRipples: "Potential ripples: ",
  addChangeProjectComplexityDescription: "The organic mode represent a small to middle sized software projects. " +
    "Most of the workers have experience with similar projects. \n" +
    "The semidetached mode is for projects that size and complexity is between the organic and embedded mode. " +
    "It is a middle sized project (50 to 300 thousands of delivered source instructions)." +
    " All workers have average experience in developing such systems. \n" +
    "The embedded mode is labeled through its tough, inflexible structures and guidelines. " +
    "It is for security relevant projects like systems for banks.",
  addChangeProjectProcessDescription: "The project and process factor is a number between 5.05 and 13.15, " +
    "that consists of several attributes which will be summed up: \n" +
    "RCPX – Product Reliability and Complexity \n" +
    "RUSE – Developed for Reusability \n" +
    "PDIF – Platform Difficulty \n" +
    "PERS – Personnel Capability \n" +
    "PREX – Personnel Experience \n" +
    "FCIL – Facilities \n",
  addChangeProjectProcessFactor: "Project and process factor",
  addChangeRippleDescription: "If you modify a service it can also affect other services. " +
    "Here you can choose these services.",
  addChangeRippleLabel: "Ripple effects",
  addChangeSemidetachedMode: "Semidetached Mode",
  addChangeTypeDescription: "Addition adds a a new service to the system.\n " +
    "Modification modify an existing service. \n" +
    "Deletion delete a service.",
  addChangesChangeDescription: "Description of change:",
  addChangesChangeType: "Change´s type:",
  addChangesCodeChanges: "change code lines",
  addChangesCodePlugin: "plugin code lines",
  addChangesHours: "hours",
  addChangesNameOfAffectedService: "Name of affected service:",
  addChangesNewChangesButton: "New Change",
  addChangesNewCode: "Lines of Code",
  addChangesSuccess: "Scenario successful created",

  /**
   * scenario categories
   */
  categoryAlgorithm: "Algorithm change",
  categoryCommunicationProtocol: "New communication protocol",
  categoryDBMS: "New database management system",
  categoryHardware: "Hardware",
  categoryMarket: "Market driven",
  categoryNewProgrammingLanguage: "New programming language technology",
  categoryNewUserLevels: "New user levels",
  categoryOS: "New operating system on server",
  categoryRemoteAdministration: "Remote administration",
  categorySafety: "Safety",
  categoryUpgradeDatabase: "Upgrade of database",
  categoryUpgradeOS: "Upgrade operating System",
  categoryUserInterface: "User interface overhaul",

  /**
   * evaluation
   */
  evaluationAverageScenario: "Average effort per scenario: ",
  evaluationAverageService: "Average effort per service: ",
  evaluationCategory: "Category",
  evaluationCategoryPlaceholder: "Filter a category",
  evaluationChangeMostServices: "Most Impactful Change",
  evaluationCosmicPoints: " Cosmic function points",
  evaluationCriticalServiceChangedMost: "Critical service that is modified most: ",
  evaluationCriticalServiceEffort: "Critical service with highest overall effort: ",
  evaluationCriticalServiceEffortLowest: "Service with lowest effort: ",
  evaluationEffort: "Summarized effort for the total system: ",
  evaluationHours: "hours",
  evaluationLOCServices: " Lines of code per affected service",
  evaluationLinesOfCode: "Lines of code",
  evaluationNoCategory: "No filter",
  evaluationNoSystem: "No System",
  evaluationStoryPoints: " Story points",
  evaluationTableCategory: "Tags",
  evaluationTableChangeCount: "Change count",
  evaluationTableEasiestChange: "Easiest change",
  evaluationTableHardestChange: "Hardest change",
  evaluationTableScenario: "Scenario",
  evaluationTableScenarioEffort: "Scenario effort",
  evaluationTableServices: "# of Affected Services",

  /**
   * System detail
   */
  systemDetailBack: "Back to overview",
  systemDetailGoToEdit: "Go to edit system",
  systemDetailGoToEvaluation: "Go to Evaluation",
  systemDetailService: "Service",
  systemDetailServiceAssociated: "Dependencies",
  systemDetailServiceDescription: "Description",

  /**
   * Scenario detail
   */
  scenarioDetailAffectedService: "Affected service",
  scenarioDetailDescription: "Description",
  scenarioDetailEffort: "Effort",
  scenarioDetailGoToEdit: "Go to edit scenario",
  scenarioDetailRipples: "Ripple to services",
  scenarioDetailType: "Type",

  /**
   * deletion dialog
   */
  deletionDialogButtonCancel: "Cancel",
  deletionDialogButtonConfirm: "Confirm",
  deletionDialogConfirmation: "Are you sure you want to delete ",
  deletionDialogTitle: "Deletion confirmation",

  /**
   * editing process aborting
   */
  stopProcessGo: "Stop and Leave",
  stopProcessStay: "Don´t Stop",
  stopProcessText: "Are you sure you want to stop the adding or editing process? " +
    "The data that was entered will be lost after leaving.",

  /**
   * effort estimation methods explanation
   */
  explanationCosmicFirst: "The COSMIC method defines principles, rules, and a process for measuring the functional " +
    "size of software. \"Functional size\" is a measure for the amount of provided functionality and " +
    "completely independent of the implementation.\n" +
    "More details about the technique can be found here: ",
  explanationCosmicInformationFound: "Exact Information",
  explanationCosmicSecond: "An example to illustrate the method is the function process \"Start cooking process\". " +
    "Here are a \"start button\", a \"heater\" and a \"cooking light\" the functional users. " +
    "The first data movement is to receive the start signal. This movement type is an entry. " +
    "The second data movement is \"sending a power-on command to the heater\" as the output data movement type. " +
    "The last data movement is \"sending a power on command to the cooker lamp\", which is an exit. " +
    "For each step, a cosmic function point is required, which yields a total of three cosmic function points.",
  explanationGeneral: "A user can estimate the cost of a change with four methods in the app. " +
    "These methods are hours, an ordinal scale, cosmic function points and story points. " +
    "The user can select an effort estimation method by hovering over the wrench found in the upper-right " +
    "corner of the app and then selects an effort estimation method and clicks the radio button for it.",
  explanationHeaderCosmic: "Cosmic Function Points",
  explanationHeaderExplanation: "Explanation of the Effort Estimation Methods",
  explanationHeaderHours: "Hours",
  explanationHeaderOrdinalScale: "Ordinal Scale",
  explanationHeaderStoryPoints: "Story Points",
  explanationHours: "A common way to estimate effort is by using development hours, " +
    "i.e. the duration it takes to implement the \"Change\".",
  explanationOrdinalScale: "With an ordinal scale from 1 to 10, the effort and complexity of a \"Change\" can " +
    "be described, where 1 is easy and not time-consuming and 10 very difficult and very time-consuming.",
  explanationStoryPointsFirst: "The size of a story is determined by its complexity. " +
    "The complexity depends on how often the layers of the architecture model is breaked through. " +
    "The storypoints are often determined by an adjusted fibonacci sequence, " +
    "e.g. 1, 2, 3, 5, 8, 13, 20, 40, 100. You can see the exact method here: ",
  explanationStoryPointsMethod: "Method",
  explanationStoryPointsSecond: "A story Point is a unit to measure the size of a user story or a feature. " +
    "A Story Point is assigned based on the effort, the complexity and the inherent " +
    "risk involved in developing a feature."
};
