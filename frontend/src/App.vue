<template>
  <v-app id="app">
    <c-navigation-drawer></c-navigation-drawer>
    <c-toolbar></c-toolbar>
    <v-layout align-start="align-start" ref="contentRef">
      <c-content></c-content>
      <v-snackbar :bottom="bottom" :class="{successMessage: !errorBool, errorMessages: errorBool}"
                  :dark="darkeningGeneral"
                  :timeout="timeout" multi-line
                  v-model="showError">{{error}}
      </v-snackbar>
    </v-layout>
    <v-layout row wrap>
      <CLeaveEditingProcessDialog :dialog="dialogEditingProcess" :routeTo="routeTo"
                                  v-on:change-route="changeRoute"
                                  v-on:closed-Dialog="setDialog"></CLeaveEditingProcessDialog>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
  import Vue from "vue";
  import {Component, Watch} from "vue-property-decorator";
  import {StringsUtilEnglish} from "./assets/StringsUtilEnglish";
  import CContent from "./components/general/CContent.vue";
  import CLeaveEditingProcessDialog from "./components/general/CLeaveEditingProcessDialog.vue";
  import CNavigationDrawer from "./components/general/CNavigationDrawer.vue";
  import CToolBar from "./components/general/CToolbar.vue";
  import ScenarioFunctions from "./model/ScenarioFunctions";
  import {ScenarioRestClient} from "./model/ScenarioRestClient";
  import {SystemRestClient} from "./model/SystemRestClient";
  import {AppStore, StateModule} from "./store/AppStore";
  import {VueStateField} from "./store/State";

  @Component({
    name: "app",
    components: {
      "c-navigation-drawer": CNavigationDrawer,
      "c-toolbar": CToolBar,
      "c-content": CContent,
      CLeaveEditingProcessDialog
    }
  })
  export default class App extends Vue {
    @VueStateField(StateModule.APP)
    public drawer: boolean;

    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @VueStateField(StateModule.GENERAL)
    public language: string;

    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @VueStateField(StateModule.GENERAL)
    public error: string;

    @VueStateField(StateModule.GENERAL)
    public timeout: number;

    @VueStateField(StateModule.GENERAL)
    public disableElements: boolean;

    @VueStateField(StateModule.GENERAL)
    public showError: boolean;

    @VueStateField(StateModule.GENERAL)
    public bottom: boolean;

    @VueStateField(StateModule.GENERAL)
    public design: number;

    @VueStateField(StateModule.SCENARIO)
    public startCreatingScenario: boolean;

    @VueStateField(StateModule.GENERAL)
    public editingProcess: boolean;

    @VueStateField(StateModule.GENERAL)
    public errorBool: boolean;

    public dialogEditingProcess: boolean = false;
    public routeTo: string = "";
    public checkerRoute: boolean = false;
    public scenarioFunctions: any = new ScenarioFunctions();

    created() {
      //set up the lang
      this.strings = StringsUtilEnglish;
      //set up the theme
      let theme = localStorage.getItem("s");
      if (theme !== null) {
        if (theme === this.strings.themeLight) {
          this.darkeningGeneral = false;
        }
        if (theme === this.strings.themeDark) {
          this.darkeningGeneral = true;
        }
      } else {
        this.darkeningGeneral = false;
      }
      //set up the design
      let designString = localStorage.getItem("design");
      let design = parseInt(designString);
      if (design !== null) {
        if (design === 1) {
          this.design = 1;
        }
        if (design === 2) {
          this.design = 2;
        }
        if (design === 3) {
          this.design = 3;
        }
        if (design === 4) {
          this.design = 4;
        }
        if (design === 5) {
          this.design = 5;
        }
      } else {
        this.design = 1;
      }

      let self = this;
      window.addEventListener("beforeunload", async function (event) {
        await ScenarioRestClient.resetChanges(
          AppStore.state.changes,
          AppStore.state.oldScenario.changes,
          AppStore.state.oldScenario.system._id,
          AppStore.state.oldScenario._id
        ).then(() => {
          self.scenarioFunctions.resetAppStore();
        });
      });
    }

    setDialog(dialog) {
      this.dialogEditingProcess = dialog;
    }

    async changeRoute(obj) {
      this.checkerRoute = obj.checker;
      if (this.checkerRoute) {
        if (AppStore.state.oldScenario.name !== "") {
          await ScenarioRestClient.resetChanges(
            AppStore.state.changes,
            AppStore.state.oldScenario.changes,
            AppStore.state.oldScenario.system._id,
            AppStore.state.oldScenario._id
          );
        }
      }
      this.$router.push(obj.route.toString());
      this.$router.replace(obj.route.toString());
      this.checkerRoute = false;
    }

    @Watch("error")
    __showError() {
      if (this.error !== "") {
        this.showError = true;
      }
    }

    @Watch("$route", {immediate: true, deep: true})
    __routeChange(from, oldVal) {
      if (
        this.startCreatingScenario &&
        AppStore.state.createdServicesScenario.length > 0
      ) {
        const createdServicesIDs = [];
        AppStore.state.createdServicesScenario.forEach((service) => {
          createdServicesIDs.push(service._id);
        });
        SystemRestClient.deleteServices(
          createdServicesIDs
        ).then(() => {
        });
        this.startCreatingScenario = false;
      }
      this.$router.beforeEach((to, from, next) => {
        if (
          (from.fullPath.includes("/add-system") &&
            this.editingProcess === true) ||
          (from.fullPath.includes("/add-scenario") &&
            this.editingProcess === true) ||
          (from.fullPath.includes("/scenarios/") &&
            this.editingProcess === true &&
            from.fullPath.includes("/edit")) ||
          (from.fullPath.includes("/systems/") &&
            this.editingProcess === true &&
            from.fullPath.includes("/edit"))
        ) {
          if (this.checkerRoute) {
            next();
          } else {
            this.dialogEditingProcess = true;
            this.routeTo = to.fullPath;
          }
        } else {
          next();
        }
      });
    }
  }
</script>

<style lang="css">
  /* Import vuetify styles */
  @import "~vuetify/dist/vuetify.min.css";
  @import "~vue-d3-network/dist/vue-d3-network.css";

  .successMessage {
    font-size: 200%;
    color: green;
  }

  .errorMessage {
    font-size: 200%;
    color: red;
  }
</style>
