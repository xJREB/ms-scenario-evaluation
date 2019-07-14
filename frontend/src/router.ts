import Vue from "vue";
import Router from "vue-router";

import RAddScenario from "./components/routes/RAddScenario.vue";
import RAddSystem from "./components/routes/RAddSystem.vue";
import REditScenario from "./components/routes/REditScenario.vue";
import REditSystem from "./components/routes/REditSystem.vue";
import REvaluation from "./components/routes/REvaluation.vue";
import RExplanationEffortMethod from "./components/routes/RExplanationEffortMethod.vue";
import ROverview from "./components/routes/ROverview.vue";
import RScenarioDetail from "./components/routes/RScenarioDetails.vue";
import RScenarioOverview from "./components/routes/RScenarioOverview.vue";
import RSystemDetail from "./components/routes/RSystemDetails.vue";
import RSystemOverview from "./components/routes/RSystemOverview.vue";

export enum R {
  HOME = "/",
  SYSTEMS = "/systems",
  ADD_SYSTEMS = "/add-system",
  SCENARIOS = "/scenarios",
  ADD_SCENARIOS = "/add-scenario",
  EVALUATION = "/evaluation",
  SYSTEMDETAILS = "/systems/:id",
  SCENARIODETAIL = "/scenarios/:id",
  EDITSYSTEM = "/systems/:id/edit",
  EDITSCENARIO = "/scenarios/:id/edit",
  SCENARIOSSELECTEDSYSTEM = "/scenarios/:id/overview",
  EVALUATIONSYSTEM = "/evaluation/:id",
  EFFORTESTIMATIONMETHODS = "/effort-estimation-methods"
}

export const NAV_ITEMS_ENGLISH = [
  {icon: "home", text: "Overview", route: R.HOME},
  {icon: "add_circle", text: "Create New System", route: R.ADD_SYSTEMS},
  {icon: "view_list", text: "System Overview", route: R.SYSTEMS},
  {icon: "add_circle", text: "Create new Scenario", route: R.ADD_SCENARIOS},
  {icon: "view_list", text: "Scenario Overview", route: R.SCENARIOS},
  {icon: "view_list", text: "Evaluation", route: R.EVALUATION}
];

const routes = [
  {path: R.HOME, component: ROverview},
  {path: R.SYSTEMS, component: RSystemOverview},
  {path: R.ADD_SYSTEMS, component: RAddSystem},
  {path: R.SCENARIOS, component: RScenarioOverview},
  {path: R.ADD_SCENARIOS, component: RAddScenario},
  {path: R.EVALUATION, component: REvaluation},
  {path: R.SYSTEMDETAILS, component: RSystemDetail},
  {path: R.SCENARIODETAIL, component: RScenarioDetail},
  {path: R.EDITSYSTEM, component: REditSystem},
  {path: R.EDITSCENARIO, component: REditScenario},
  {path: R.SCENARIOSSELECTEDSYSTEM, component: RScenarioOverview},
  {path: R.EVALUATIONSYSTEM, component: REvaluation},
  {path: R.EFFORTESTIMATIONMETHODS, component: RExplanationEffortMethod}
];

export default new Router({
  routes
});

Vue.use(Router);
