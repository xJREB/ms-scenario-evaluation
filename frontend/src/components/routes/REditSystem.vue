<template>
  <v-layout id="root">
    <!-- This component is the route to the edit system view. This component is responsible for editing a system-->
    <v-flex>
      <v-layout row v-if="!loadData" wrap>
        <v-flex>
          <v-stepper :dark="darkeningGeneral" v-model="stepper">
            <v-stepper-header>
              <v-stepper-step :complete="stepper > 1" editable step="1">Edit System</v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepper > 2" step="2">Edit Services</v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3">Graphical Overview of the System</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-layout row wrap>
                  <CAddSystem :system="appStore.state.system" ref="system"
                              v-on:whole-system="saveSystemData"></CAddSystem>
                </v-layout>
                <v-layout align-end justify-end row wrap>
                  <v-btn @click="checkFirstStep()" color="primary">
                    {{strings.addSystemContinueButton}}
                  </v-btn>
                </v-layout>
                <v-layout align-end justify-end row v-show="errorStepOne" wrap>
                  <label class="errorMessage">{{strings.ruleFillAllFieldsCorrect}}</label>
                </v-layout>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-layout row wrap>
                  <CExpansionPanelServices ref="expansionPanel"
                                           v-on:whole-service="saveServiceData"></CExpansionPanelServices>
                </v-layout>
                <v-layout row style="margin-top: 20px; margin-bottom: 20px;"
                          v-if="appStore.state.services.length > 0"
                          wrap>
                  <v-divider></v-divider>
                </v-layout>
                <v-layout row v-if="!addServiceMode" wrap>
                  <v-btn @click="addServiceMode = true">
                    {{strings.addServiceNewServiceButton}}
                    <v-icon dark right>add_circle</v-icon>
                  </v-btn>
                </v-layout>
                <v-layout row v-else wrap>
                  <v-flex>
                    <v-layout row wrap>
                      <CAddService :service="appStore.state.service"
                                   :services="appStore.state.services"
                                   ref="services"
                                   v-on:whole-service="saveServiceData"></CAddService>
                    </v-layout>
                    <v-layout row wrap>
                      <v-btn @click="abortAdding()">{{strings.addServiceAbort}}</v-btn>
                      <v-btn @click="saveNewService()" color="primary">
                        {{strings.addServiceSaveButton}}
                      </v-btn>
                    </v-layout>
                    <CErrorMessageSteps
                      :errorMessageOne="strings.ruleFillAllFieldsCorrect"
                      :errorMessageTwo="''"
                      :errorOne="errorSavingService"
                      :errorTwo="false"
                      style="margin-left: 2px"
                    ></CErrorMessageSteps>
                  </v-flex>
                </v-layout>
                <v-layout align-end justify-end row wrap>
                  <v-btn @click="stepper--" flat>{{strings.addSystemBackButton}}</v-btn>
                  <v-btn :disabled="appStore.state.services.length === 0" color="primary"
                         v-if="appStore.state.services.length === 0">
                    {{strings.addSystemContinueButton}}
                  </v-btn>
                  <v-btn @click="continueToGraph()" color="primary" v-else>
                    {{strings.addSystemContinueButton}}
                  </v-btn>
                </v-layout>
                <CErrorMessageSteps :errorMessageOne="''"
                                    :errorMessageTwo="strings.ruleSystemRequireService"
                                    :errorOne="false"
                                    :errorTwo="errorAtLeastOneService"></CErrorMessageSteps>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-layout row wrap>
                  <CGraphOfSystem :services="appStore.state.services" ref="graph"></CGraphOfSystem>
                </v-layout>
                <v-layout align-end justify-end row wrap>
                  <v-btn @click="stepper--" flat>{{strings.addSystemBackButton}}</v-btn>
                  <v-btn :disabled="appStore.state.services.length === 0" color="primary"
                         v-if="appStore.state.services.length === 0">
                    {{strings.addSystemSaveButton}}
                  </v-btn>
                  <v-btn :disabled="disableElements" @click="saveSystem()" color="primary" v-else>
                    {{strings.addSystemSaveButton}}
                  </v-btn>
                </v-layout>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-flex>
      </v-layout>
      <v-layout row v-else wrap>
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
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Watch} from "vue-property-decorator";
  import HelperFunctions from "../../model/HelperFunctions";
  import IService from "../../model/IService";
  import ISystem from "../../model/ISystem";
  import {SystemRestClient} from "../../model/SystemRestClient";
  import {AppStore, StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";
  import CAddService from "../general/CAddService.vue";
  import CAddSystem from "../general/CAddSystem.vue";
  import CErrorMessageSteps from "../general/CErrorMessageSteps.vue";
  import CExpansionPanelServices from "../general/CExpansionPanelServices.vue";
  import CGraphOfSystem from "../general/CGraphOfSystem.vue";

  @Component({
    components: {
      CExpansionPanelServices,
      CAddSystem,
      CAddService,
      CErrorMessageSteps,
      CGraphOfSystem
    }
  })
  export default class REditSystem extends Vue {
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

    @VueStateField(StateModule.GENERAL)
    public disableElements: boolean;

    @VueStateField(StateModule.GENERAL)
    public firstSave: boolean;

    @VueStateField(StateModule.SYSTEM)
    public editingSystem: boolean;

    @VueStateField(StateModule.GENERAL)
    public loadData: boolean;

    @VueStateField(StateModule.GENERAL)
    public editingProcess: boolean;

    public helper: any = new HelperFunctions();
    public appStore: any = AppStore;

    public stepper: number = 1;
    public addServiceMode: boolean = false;

    public errorStepOne: boolean = false;
    public errorSavingService: boolean = false;
    public errorAtLeastOneService: boolean = false;

    public oldSystem: ISystem = {
      name: "",
      description: "",
      services: new Array<IService>(),
      _id: ""
    } as ISystem;

    $refs!: {
      system: any;
      services: any;
      expansionPanel: any;
      graph: any;
    };

    /**
     * This method is called when all services are created and lead you to the final step where a graphical representation
     * of the system is shown.
     */
    public continueToGraph() {
      this.stepper++;
      this.$refs.graph.createGraph();
    }

    /**
     * This method is called after the component is initialized. It sets the necessary data.
     */
    public async mounted() {
      this.editingProcess = false;
      this.editingSystem = true;
      // noinspection TypeScriptUnresolvedVariable
      this.oldSystem = await SystemRestClient.getSystemById(
        this.$route.params.id
      );
      //filter additional services that was added through scenarios
      this.oldSystem.services = this.oldSystem.services.filter(
        service => !service.name.includes("[new addition]")
      );
      if (
        AppStore.state.system._id === "" ||
        AppStore.state.system._id === undefined
      ) {
        this.loadData = true;
        // noinspection TypeScriptUnresolvedVariable
        let system = await SystemRestClient.getSystemById(this.$route.params.id);
        //filter additional services that was added through scenarios
        system.services = system.services.filter(
          service => !service.name.includes("[new addition]")
        );
        this.setDetails(
          system._id,
          system.name,
          system.description,
          system.services,
          system
        );
        this.loadData = false;
      }
    }

    /**
     * this method initialize setting the services and system in the vuex store
     */
    public setDetails(id, name, description, services, system) {
      this.setEditAppStoreData(name, id, description, system);
      if (services !== undefined) {
        AppStore.commit("setServices", services);
      }
    }

    /**
     * this method set the system and services and the vuex store
     */
    public setEditAppStoreData(name, id, description, system) {
      AppStore.commit("setCompleteSystem", system);
      AppStore.commit("setSystemName", name);
      AppStore.commit("setSystemID", id);
      AppStore.commit("setSystemDescription", description);
    }

    /**
     * this method check if the system and its services are valid and initialise the creating system process. If in editing
     * mode, then it deletes a system and after that it creates a new one.
     */
    public async saveSystem() {
      this.errorAtLeastOneService = AppStore.state.services.length <= 0;
      if (!this.errorAtLeastOneService) {
        //for some reason this method is called more than once, so you block this anomaly with a boolean
        if (!this.firstSave) {
          //so that you can´t click the creating button more than once while creating, this variable block the creating button
          this.disableElements = true;
          this.firstSave = true;
          SystemRestClient.updateSystem(
            AppStore.state.system,
          )
            .then(async () => {
              this.editingProcess = false;
              this.$router.push("/systems");
              this.$router.replace("/systems");
              this.helper.showError(
                this.strings.addSystemSuccess,
                this.timeout,
                false
              );
            })
            .catch(e => {
              this.helper.showError(e.message, this.timeout, true);
            });
        }
      }
    }

    /**
     * this method adds a service to all services in the AppStore
     */
    public saveNewService() {
      this.$refs.services.validation();
      this.$refs.services.getNameAndDescription();
      if (
        AppStore.state.service.name === "" ||
        AppStore.state.service.name.length > 50 ||
        AppStore.state.service.description.length > 150
      ) {
        this.errorSavingService = true;
      } else {
        this.errorAtLeastOneService = false;
        this.$refs.services.resetValidation();
        AppStore.commit("addService", AppStore.state.service);
        this.addServiceMode = false;
        AppStore.commit("resetService");
        this.errorSavingService = false;
      }
    }

    /**
     * this method abort the service adding process
     */
    public abortAdding() {
      this.addServiceMode = false;
      this.errorSavingService = false;
      AppStore.commit("resetService");
    }

    /**
     * this method validates the system data and navigate to the second step
     */
    public checkFirstStep() {
      this.$refs.system.validation();
      this.$refs.system.getNameAndDescription();
      if (
        AppStore.state.system.name !== "" &&
        AppStore.state.system.name.length < 50 &&
        AppStore.state.system.description.length < 150
      ) {
        this.stepper++;
        this.editingProcess = true;
        this.errorStepOne = false;
        this.$refs.system.resetValidation();
      } else {
        this.errorStepOne = true;
      }
    }

    /**
     * save emitted data to the AppStore
     * @param system
     */
    public saveSystemData(system: ISystem) {
      AppStore.commit("setSystemName", system.name);
      AppStore.commit("setSystemDescription", system.description);
    }

    /**
     * save emitted data to the AppStore
     * @param service
     */
    public saveServiceData(service: IService) {
      AppStore.commit("setService", service);
    }

    @Watch("addServiceMode")
    public __closeExpansionPanel() {
      this.$refs.expansionPanel.closePanel();
    }

    /**
     * method reset the entire AppStore, when the component is destroyed, when you navigate to a different component
     */
    public beforeDestroy() {
      AppStore.commit("resetSystem");
      AppStore.commit("resetService");
      AppStore.commit("resetServices");
      this.editingSystem = false;
      this.disableElements = false;
    }
  }
</script>

<style scoped>
  #root {
    min-height: 100vh;
    height: 100%;
  }
</style>
