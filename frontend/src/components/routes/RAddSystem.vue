<template>
  <v-layout id="root" row wrap>
    <!-- This component is the route to the adding system. It saves a newly created system after the process-->
    <v-flex>
      <v-stepper :dark="darkeningGeneral" v-model="stepper">
        <v-stepper-header>
          <v-stepper-step :complete="stepper > 1" editable step="1">{{strings.addSystemStepOne}}
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="stepper > 2" step="2">{{strings.addSystemStepTwo}}</v-stepper-step>

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
              <v-btn @click="checkFirstStep()" color="primary">{{strings.addSystemContinueButton}}</v-btn>
            </v-layout>
            <CErrorMessageSteps
              :errorMessageOne="strings.ruleFillAllFieldsCorrect"
              :errorMessageTwo="''"
              :errorOne="errorStepOne"
              :errorTwo="false"
              style="margin-left: 2px"
            ></CErrorMessageSteps>
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
                  <CAddService :service="appStore.state.service" :services="appStore.state.services"
                               ref="services"
                               v-on:whole-service="saveServiceData"></CAddService>
                </v-layout>
                <v-layout row wrap>
                  <v-btn @click="abortAdding()">{{strings.addServiceAbort}}</v-btn>
                  <v-btn @click="saveNewService()" color="primary">{{strings.addServiceSaveButton}}
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
                     v-if="appStore.state.services.length === 0">{{strings.addSystemContinueButton}}
              </v-btn>
              <v-btn @click="continueToGraph()" color="primary" v-else>
                {{strings.addSystemContinueButton}}
              </v-btn>
            </v-layout>
            <CErrorMessageSteps :errorMessageOne="''" :errorMessageTwo="strings.ruleSystemRequireService"
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
                     v-if="appStore.state.services.length === 0">{{strings.addSystemSaveButton}}
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
  export default class RAddSystem extends Vue {
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
    public editingProcess: boolean;

    public helper: any = new HelperFunctions();
    public appStore: any = AppStore;

    public stepper: number = 1;
    public addServiceMode: boolean = false;

    public errorStepOne: boolean = false;
    public errorSavingService: boolean = false;
    public errorAtLeastOneService: boolean = false;

    $refs!: {
      system: any;
      services: any;
      expansionPanel: any;
      graph: any;
    };

    /**
     * method for continuing to the third step of the stepper
     */
    public continueToGraph() {
      this.stepper++;
      this.$refs.graph.createGraph();
    }

    /**
     * when this component is initialized, the editing process will be set false
     */
    async mounted() {
      this.editingProcess = false;
    }

    /**
     * this method check if the system and its services are valid and initialte the creating system process. If in editing
     * mode, then it deletes a system and after that it creates a new one.
     */
    async saveSystem() {
      this.errorAtLeastOneService = AppStore.state.services.length <= 0;
      if (!this.errorAtLeastOneService) {
        //for some reason this method is called more than once, so you block this anomaly with a boolean
        if (!this.firstSave) {
          //so that you can´t click the creating button more than once while creating, this variable block the creating button
          this.disableElements = true;
          this.firstSave = true;
          await this.createSystem();
        }
      }
    }

    /**
     * this method saves a new system in the backend
     */
    async createSystem() {
      let self = this;
      let system = {
        name: AppStore.state.system.name,
        description: AppStore.state.system.description
      } as ISystem;
      SystemRestClient.createSystem(system, AppStore.state.services)
        .then(async response => {
          this.editingProcess = false;
          self.$router.push("/systems");
          self.$router.replace("/systems");
          this.helper.showError(
            self.strings.addSystemSuccess,
            this.timeout,
            false
          );
        })
        .catch(e => {
          this.helper.showError(e.message, this.timeout, true);
        });
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
      AppStore.commit("setServiceWithoutID", service);
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
