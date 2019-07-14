<template>
  <v-layout id="root">
    <!-- This component is the route to the adding scenario. It saves a newly created scenario after the process-->
    <v-flex>
      <v-layout row v-if="loadData" wrap>
        <v-card :dark="darkeningGeneral">
          <v-card-text :dark="darkeningGeneral">
            <v-container grid-list-md>
              <v-label :dark="darkeningGeneral">{{strings.loading}}</v-label>
              <br>
              <v-progress-linear :indeterminate="true"></v-progress-linear>
            </v-container>
          </v-card-text>
        </v-card>
      </v-layout>
      <v-layout row v-if="!loadData" wrap>
        <v-flex>
          <v-stepper :dark="darkeningGeneral" v-model="stepper">
            <v-stepper-header>
              <v-stepper-step :complete="stepper > 1" editable step="1">{{strings.addScenarioHeader}}
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="2">{{strings.addScenarioStepTwo}}</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-layout row wrap>
                  <CAddScenario
                    :scenario="appStore.state.scenario"
                    :systemNameProp="appStore.state.system.name"
                    :systemNames="appStore.state.systemNames"
                    ref="scenario"
                    v-on:whole-scenario="saveScenarioData"
                  ></CAddScenario>
                </v-layout>
                <v-layout align-end justify-end row wrap>
                  <v-btn @click="checkFirstStep()" color="primary">
                    {{strings.addSystemContinueButton}}
                  </v-btn>
                </v-layout>
                <CErrorMessageSteps :errorMessageOne="''"
                                    :errorMessageTwo="strings.ruleFillAllFieldsCorrect"
                                    :errorOne="false"
                                    :errorTwo="errorStepOne"></CErrorMessageSteps>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-layout row wrap>
                  <CExpansionPanelChanges ref="expansionPanel"
                                          v-on:whole-change="addChange"></CExpansionPanelChanges>
                </v-layout>
                <v-layout row style="margin-top: 20px; margin-bottom: 20px;"
                          v-if="appStore.state.changes.length > 0"
                          wrap>
                  <v-divider></v-divider>
                </v-layout>
                <v-layout row v-if="!addChangesMode" wrap>
                  <v-btn @click="addChangesMode = true">
                    {{strings.addChangesNewChangesButton}}
                    <v-icon dark right>add_circle</v-icon>
                  </v-btn>
                </v-layout>
                <v-layout row v-else wrap>
                  <v-flex>
                    <v-layout row wrap>
                      <CAddChange
                        :affectedService="appStore.state.change.service"
                        :change="appStore.state.change"
                        :changeTypes="types"
                        :serviceNames="appStore.state.serviceNames"
                        :system="appStore.state.system"
                        ref="change"
                        v-on:whole-change="addChange"
                      ></CAddChange>
                    </v-layout>
                    <v-layout row wrap>
                      <v-btn @click="abortAdding()">{{strings.addServiceAbort}}</v-btn>
                      <v-btn @click="saveNewChange()" color="primary">
                        {{strings.addServiceSaveButton}}
                      </v-btn>
                    </v-layout>
                    <CErrorMessageSteps
                      :errorMessageOne="strings.ruleFillAllFieldsCorrect"
                      :errorMessageTwo="''"
                      :errorOne="errorSavingChange"
                      :errorTwo="false"
                      style="margin-left: 2px"
                    ></CErrorMessageSteps>
                  </v-flex>
                </v-layout>
                <v-layout align-end justify-end row wrap>
                  <v-btn @click="stepper--" flat>{{strings.addSystemBackButton}}</v-btn>
                  <v-btn :disabled="appStore.state.changes.length === 0" color="primary"
                         v-if="appStore.state.changes.length === 0">
                    {{strings.addScenarioSaveButton}}
                  </v-btn>
                  <v-btn :disabled="disableSaveButton" @click="saveScenario()" color="primary" v-else>
                    {{strings.addScenarioSaveButton}}
                  </v-btn>
                </v-layout>
                <CErrorMessageSteps :errorMessageOne="''"
                                    :errorMessageTwo="strings.ruleScenarioRequireChange"
                                    :errorOne="false"
                                    :errorTwo="errorAtLeastOneChange"></CErrorMessageSteps>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Watch} from "vue-property-decorator";
  import {config} from "../../config";
  import HelperFunctions from "../../model/HelperFunctions";
  import IEmittedChange from "../../model/IEmittedChange";
  import IEmittedScenario from "../../model/IEmittedScenario";
  import IService from "../../model/IService";
  import ISystem from "../../model/ISystem";
  import ScenarioFunctions from "../../model/ScenarioFunctions";
  import {ScenarioRestClient} from "../../model/ScenarioRestClient";
  import {SystemRestClient} from "../../model/SystemRestClient";
  import {AppStore, StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";
  import CAddChange from "../general/CAddChange.vue";
  import CAddScenario from "../general/CAddScenario.vue";
  import CErrorMessageSteps from "../general/CErrorMessageSteps.vue";
  import CExpansionPanelChanges from "../general/CExpansionPanelChanges.vue";

  @Component({
    components: {
      CAddScenario,
      CExpansionPanelChanges,
      CAddChange,
      CErrorMessageSteps
    }
  })
  export default class RAddScenario extends Vue {
    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @VueStateField(StateModule.GENERAL)
    public design: number;

    @VueStateField(StateModule.GENERAL)
    public error: string;

    @VueStateField(StateModule.GENERAL)
    public timeout: number;

    @VueStateField(StateModule.SCENARIO)
    public editingScenario: boolean;

    @VueStateField(StateModule.SCENARIO)
    public startCreatingScenario: boolean;

    @VueStateField(StateModule.GENERAL)
    public loadData: boolean;

    @VueStateField(StateModule.GENERAL)
    public disableElements: boolean;

    @VueStateField(StateModule.GENERAL)
    public firstSave: boolean;

    @VueStateField(StateModule.GENERAL)
    public editingProcess: boolean;

    @VueStateField(StateModule.SYSTEM)
    public systemName: string;

    public stepper: number = 1;
    public addChangesMode: boolean = false;
    public types: any = config.changeTypes;

    public helper: any = new HelperFunctions();
    public appStore: any = AppStore;

    public errorStepOne: boolean = false;
    public errorSavingChange: boolean = false;
    public errorAtLeastOneChange: boolean = false;
    public disableSaveButton: boolean = false;

    public systems: ISystem[] = [];
    public scenarioFunctions: any = new ScenarioFunctions();

    $refs!: {
      scenario: any;
      change: any;
      expansionPanel: any;
    };

    /**
     * method is called when the html part is build. It initialise the data needed.
     */
    async mounted() {
      this.startCreatingScenario = true;
      await this.init();
    }

    /**
     * initialise the component by getting all systems
     */
    async init() {
      this.loadData = true;
      this.editingProcess = false;
      this.systems = await SystemRestClient.getSystems();
      this.loadData = false;
      AppStore.commit("setSystems", this.systems);
    }

    /**
     * save the scenario data in the AppStore
     */
    public saveScenarioData(data: IEmittedScenario) {
      let index = this.systems.findIndex(
        system => system.name === data.systemName
      );
      if (index !== -1) {
        AppStore.commit("addScenario", {
          system: this.systems[index],
          scenarioName: data.name,
          scenarioDescription: data.description,
          category: data.category,
          tags: data.tags
        });
      }
    }

    /**
     * this method validates the first step, the creating scenario step
     */
    public checkFirstStep() {
      this.$refs.scenario.validation();
      this.$refs.scenario.getData();
      if (
        AppStore.state.scenario.name !== "" &&
        AppStore.state.system.name !== "" &&
        AppStore.state.scenario.name.length < 50 &&
        AppStore.state.scenario.description.length < 150
      ) {
        this.stepper++;
        this.editingProcess = true;
        this.errorStepOne = false;
        this.$refs.scenario.resetValidation();
      } else {
        this.errorStepOne = true;
      }
    }

    /**
     * this method abort adding a change
     */
    public abortAdding() {
      this.addChangesMode = false;
      this.errorSavingChange = false;
      AppStore.commit("resetChange");
    }

    /**
     * add a change in the AppStore
     */
    async addChange(data: IEmittedChange) {
      let affectedService = await this.convertAffectedServiceNameToService(data);
      if (affectedService !== undefined) {
        await this.afterGetAffectedService(data, affectedService);
      }
    }

    /**
     * method adds a change into the vuex store
     */
    async afterGetAffectedService(data, affectedService) {
      await SystemRestClient.getSystemById(AppStore.state.system._id).then(
        actualSystem => {
          this.scenarioFunctions.setChangeInAppStore(
            data,
            affectedService,
            actualSystem
          );
          if (
            AppStore.state.change.type === "" ||
            AppStore.state.change.service.name === "" ||
            AppStore.state.change.service.name === undefined ||
            AppStore.state.change.description === "" ||
            AppStore.state.change.description === undefined ||
            AppStore.state.change.description.length > 150
          ) {
            this.errorSavingChange = true;
          } else {
            this.errorAtLeastOneChange = false;
            AppStore.commit("addChange", AppStore.state.change);
            this.addChangesMode = false;
            AppStore.commit("resetChange");
            this.errorSavingChange = false;
          }
        }
      );
    }

    /**
     * this method convert the name of the affected service into a IService with all attributes
     */
    async convertAffectedServiceNameToService(data: IEmittedChange) {
      let actualSystem: ISystem = await SystemRestClient.getSystemById(
        AppStore.state.system._id
      );
      // find index of the name of the affected service and save the complete affected service
      let indexService = actualSystem.services.findIndex(service => {
        return service.name === data.affectedService;
      });
      let affectedService = {} as IService;
      if (indexService !== -1) {
        affectedService = actualSystem.services[indexService];
        return affectedService;
      } else {
        await SystemRestClient.createService({
          name: `[new addition] ${data.affectedService}`,
          description: "",
          system: actualSystem,
          associations: []
        })
          .then(async response => {
            affectedService = response.data.service;
            AppStore.commit("addServiceToRipple", affectedService);
            AppStore.commit("addCreatedService", affectedService);
            await this.afterGetAffectedService(data, affectedService);
          })
          .catch(error => {
            this.helper.showError(error.message, this.timeout, true);
          });
      }
    }

    /**
     * this method save a new change to the AppStore to all changes
     */
    async saveNewChange() {
      this.$refs.change.validation();
      this.$refs.change.getData();
    }

    /**
     * this method update a scenario in the editing mode and create a new one else
     */
    async saveScenario() {
      this.errorAtLeastOneChange = AppStore.state.changes.length <= 0;
      if (!this.errorAtLeastOneChange) {
        if (!this.firstSave) {
          //disable the save button so you can´t click twice during the creation process
          this.disableSaveButton = true;
          this.startCreatingScenario = false;
          this.firstSave = true;
          AppStore.commit("setScenarioEffort");
          await this.createScenarioInBackend();
        }
      }
    }

    /**
     * this method create a new scenario in the backend
     */
    public createScenarioInBackend() {
      let self = this;
      ScenarioRestClient.createScenario(
        AppStore.state.scenario,
        AppStore.state.changes
      )
        .then(() => {
          this.editingProcess = false;
          self.$router.push("/scenarios");
          self.$router.replace("/scenarios");
          this.systemName = AppStore.state.scenario.system.name;
          this.helper.showError(
            self.strings.addChangesSuccess,
            this.timeout,
            false
          );
        })
        .catch(error => {
          this.helper.showError(error.message, this.timeout, true);
        });
    }

    /**
     * this method closed the expansion panel once the new change button is clicked
     */
    @Watch("addChangesMode")
    public __closeExpansionPanel() {
      this.$refs.expansionPanel.closePanel();
    }

    /**
     * reset the AppStore and editing variables
     */
    public beforeDestroy() {
      this.scenarioFunctions.resetAppStore();
    }
  }
</script>

<style scoped>
  #root {
    min-height: 100vh;
    height: 100%;
  }
</style>
