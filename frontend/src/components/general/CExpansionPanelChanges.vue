<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-layout row wrap>
    <!-- this component creates the expansion panel for the changes -->
    <v-expansion-panel expand v-model="panel">
      <v-expansion-panel-content :key="index" v-for="(change ,index) in appStore.state.changes">
        <template v-slot:header>
          <div ref="header">
            <v-layout row wrap>
              <v-flex>{{change.type}}: {{change.description}}</v-flex>
            </v-layout>
          </div>
        </template>
        <v-card>
          <v-card-text
            v-bind:class="{ darkThemeBackgroundExpand: darkeningGeneral, lightThemeBackgroundExpand: !darkeningGeneral }"
            v-show="!editing">
            <v-divider></v-divider>
            <v-layout row wrap>
              <v-flex pa-1 shrink>{{strings.addChangeLabelType}}</v-flex>
              <v-flex grow pa-1>{{change.type}}</v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row wrap>
              <v-flex pa-1 shrink>{{strings.addChangeLabelAffectedService}}</v-flex>
              <v-flex grow pa-1>{{change.service.name}}</v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row v-show="change.ripples.length > 0" wrap>
              <v-flex pa-1 shrink>{{strings.addChangeLabelRipple}}</v-flex>
              <v-flex grow pa-1>
                <span :key="index" row v-for="(service, index) in change.ripples" wrap>
                  {{service.name}}
                  <br>
                </span>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
            <v-layout row wrap>
              <v-flex pa-1 shrink>{{strings.addChangeLabelEffort}}</v-flex>
              <v-flex grow pa-1 v-show="design === 1">{{change.effortHours}} {{strings.addChangesHours}}
              </v-flex>
              <v-flex grow pa-1 v-show="design === 2">{{change.effortOrdinal}}</v-flex>
              <v-flex grow pa-1 v-show="design === 4">{{change.effortCosmicFunctionPoints}}
                {{strings.addChangeEffortCosmicPointsLabel}}
              </v-flex>
              <v-flex grow pa-1 v-show="design === 5">{{change.effortStoryPoints}}
                {{strings.addChangeEffortStoryPointsLabel}}
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text
            v-bind:class="{ darkThemeBackgroundExpand: darkeningGeneral, lightThemeBackgroundExpand: !darkeningGeneral }"
            v-if="!editing">
            <v-layout align-end justify-end row wrap>
              <v-icon @click="startEditing(change)" class="mr-2" small>edit</v-icon>
              <v-icon @click="deleteChange(index, change)" small>delete</v-icon>
            </v-layout>
          </v-card-text>
          <v-card-text
            v-bind:class="{ darkThemeBackgroundExpand: darkeningGeneral, lightThemeBackgroundExpand: !darkeningGeneral }"
            v-else>
            <v-flex>
              <v-layout row wrap>
                <CAddChange
                  :affectedService="change.service"
                  :change="change"
                  :changeTypes="types"
                  :serviceNames="appStore.state.serviceNames"
                  :system="appStore.state.system"
                  ref="change"
                  v-on:whole-change="editChange"
                ></CAddChange>
              </v-layout>
              <v-layout row wrap>
                <v-btn @click="abortEditing(index)">{{strings.addServiceAbort}}</v-btn>
                <v-btn @click="saveEditedChange(index)" color="primary">
                  {{strings.addServiceSaveButton}}
                </v-btn>
              </v-layout>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Watch} from "vue-property-decorator";
  import {config} from "../../config";
  import HelperFunctions from "../../model/HelperFunctions";
  import IChange from "../../model/IChange";
  import IEmittedChange from "../../model/IEmittedChange";
  import IService from "../../model/IService";
  import ISystem from "../../model/ISystem";
  import {SystemRestClient} from "../../model/SystemRestClient";
  import {AppStore, StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";
  import CAddChange from "./CAddChange.vue";

  @Component({
    components: {
      CAddChange
    },
    beforeRouteLeave(route, redirect, next) {
      console.log("route change");
      next();
    }
  })
  export default class CExpansionPanelChanges extends Vue {
    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @VueStateField(StateModule.GENERAL)
    public design: number;

    @VueStateField(StateModule.GENERAL)
    public timeout: number;

    public appStore: any = AppStore;

    public editing: boolean = false;

    public types: any = config.changeTypes;

    public errorSavingChange: boolean = false;

    public index: number = 0;

    public editingChange: IChange = {} as IChange;

    public helper: any = new HelperFunctions();

    public blockDelete: boolean = false;

    public panel = [];
    public openPanelTab = -1;
    public oldOpen = -1;

    $refs!: {
      change: any;
      header: any;
    };

    /**
     * add a change in the AppStore
     */
    async editChange(data: IEmittedChange) {
      // if the edited service is now a new addition then it need to be added in the array for
      // the ripple selection
      if (this.editingChange.service.name.includes("[new addition]")) {
        AppStore.commit("addServiceToRipple", this.editingChange.service);
      }
      // if the edit is now an addition and was before a deletion or modification then the service needs
      // to be created in the database
      if (
        this.editingChange.service.name.includes("[new addition]") &&
        data.change.type !== this.types[1]
      ) {
        await SystemRestClient.deleteService(this.editingChange.service._id).then(
          async () => {
            data.rippleNames = data.rippleNames.filter(
              ripple => ripple === this.editingChange.service.name
            );
            AppStore.commit(
              "removeServiceFromChange",
              this.editingChange.service
            );
            let affectedService = await this.convertAffectedServiceNameToService(
              data
            );
            if (affectedService !== undefined) {
              await this.afterGetAffectedService(data, affectedService);
            }
          }
        );
      } else {
        // if the edited service was an addition before then it need to be updated in the database
        if (
          data.change.type === this.types[1] &&
          this.editingChange.service.name.includes("[new addition]")
        ) {
          let updatedService: IService = {
            _id: this.editingChange.service._id,
            name: `[new addition] ${data.affectedService}`,
            description: "",
            system: this.editingChange.service.system,
            associations: []
          };
          await SystemRestClient.updateService(
            updatedService._id,
            updatedService
          ).then(async service => {
            await this.afterGetAffectedService(data, service.data.service);
          });
        } else {
          let affectedService = await this.convertAffectedServiceNameToService(
            data
          );
          if (affectedService !== undefined) {
            await this.afterGetAffectedService(data, affectedService);
          }
        }
      }
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
            await this.afterGetAffectedService(data, affectedService);
          })
          .catch(error => {
            this.helper.showError(error.message, this.timeout, true);
          });
      }
    }

    /**
     * this method sets the change in the vuex store
     */
    public async afterGetAffectedService(data, affectedService) {
      await SystemRestClient.getSystemById(AppStore.state.system._id).then(
        actualSystem => {
          let ripples = this.convertRippleNamesToRippleService(
            data,
            actualSystem
          );
          AppStore.commit("setChange", {
            service: affectedService,
            ripples: ripples,
            scenarioName: AppStore.state.scenario.name,
            type: data.change.type,
            description: data.change.description,
            effortHours: data.change.effortHours,
            effortOrdinal: data.change.effortOrdinal,
            effortCodeNew: data.change.effortCodeNew,
            effortCosmicFunctionPoints: data.change.effortCosmicFunctionPoints,
            cosmicType: data.change.cosmicType,
            effortStoryPoints: data.change.effortStoryPoints
          });
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
            if (
              this.editingChange.service.name.includes("[new addition]") &&
              data.change.type !== this.types[1]
            ) {
              AppStore.commit("addChange", AppStore.state.change);
            } else {
              AppStore.commit("editChange", {
                change: AppStore.state.change,
                index: this.index
              });
            }
            AppStore.commit("resetChange");
            this.editing = false;
            this.errorSavingChange = true;
          }
        }
      );
    }

    /**
     * this method convert the service names in the ripple array to IService
     */
    public convertRippleNamesToRippleService(
      data: IEmittedChange,
      actualSystem: ISystem
    ) {
      // find all ripple services
      let ripples = Array<IService>();
      let indexService = 0;
      for (let i = 0; i < data.rippleNames.length; i++) {
        indexService = actualSystem.services.findIndex(service => {
          return service.name === data.rippleNames[i];
        });
        if (indexService !== -1) {
          ripples.push(actualSystem.services[indexService]);
        } else {
          ripples.push({} as IService);
        }
      }
      //eliminate the affected service of the ripples
      indexService = ripples.findIndex(
        service => service.name === data.affectedService
      );
      if (indexService !== -1) {
        ripples.splice(indexService, 1);
      }
      return ripples;
    }

    /**
     * this method removes a change from the expansion panel and the vuex store and delete a newly created service
     * @param index
     * @param change
     */
    public async deleteChange(index, change) {
      if (change.service.name.includes("[new addition]")) {
        await SystemRestClient.deleteService(change.service._id).then(
          async () => {
            AppStore.commit("deleteCreatedService", change.service);
            AppStore.commit("removeServiceFromChange", change.service);
          }
        );
      } else {
        AppStore.commit("removeChange", index);
      }
    }

    /**
     * this method saves a change that is edited
     * @param index
     */
    public saveEditedChange(index) {
      this.index = index;
      this.$refs.change[index].getData();
      this.$refs.change[index].validation();
    }

    /**
     * this method abort the editing process of a change
     * @param index
     */
    public abortEditing(index) {
      this.$refs.change[index].resetValidation();
      this.editing = false;
      if (this.editingChange.service.name.includes("[new addition]")) {
        AppStore.commit("addServiceToRipple", this.editingChange.service);
      }
      AppStore.commit("resetChange");
    }

    /**
     * this method start the editing process of a change
     * @param change
     */
    public startEditing(change: IChange) {
      this.editing = true;
      this.editingChange = change;
      if (change.service.name.includes("[new addition]")) {
        AppStore.commit("removeServiceFromRipple", change.service);
      }
    }

    /**
     * if a user reload the window, created services like [new addition] service, should be removed
     */
    public created() {
      let self = this;
      window.addEventListener("beforeunload", async function (event) {
        if (!self.blockDelete) {
          self.blockDelete = true;
          const createdServicesIDs = [];
          AppStore.state.createdServicesScenario.forEach((service) => {
            createdServicesIDs.push(service._id);
          });
          SystemRestClient.deleteServices(
            createdServicesIDs
          ).then(() => {
          });
        }
      });
    }

    /**
     * Reset the panel
     */
    public closePanel() {
      this.panel = [];
    }

    /**
     * this method checks what panel tab is open and sets a color to visualize its openness
     * @private
     */
    @Watch("panel")
    public __adjustBackgroundColorHeader() {
      let name = "grey";
      if (this.darkeningGeneral) {
        name = "darkThemeBackgroundExpand";
      } else {
        name = "lightThemeBackgroundExpand";
      }
      if (this.oldOpen !== -1) {
        // noinspection TypeScriptValidateJSTypes
        const indices = this.panel.reduce(
          (out, bool, index) => bool ? out.concat(index) : out,
          []
        );
        if (indices.length >= 2) {
          this.panel[this.oldOpen] = false;
        }
        if (this.$refs.header[this.openPanelTab] !== undefined) {
          this.$refs.header[this.openPanelTab].classList.remove(name);
        }
      }
      for (let i = 0; i < this.panel.length; i++) {
        if (this.panel[i] === true) {
          let arr = this.$refs.header[i].className.split(" ");
          if (arr.indexOf(name) == -1) {
            this.$refs.header[i].className += " " + name;
          }
          this.openPanelTab = i;
          this.oldOpen = i;
        }
      }
    }

    /**
     * this method sets the background color for the editing dialog
     * @private
     */
    @Watch("editing")
    public __adjustBackgroundEditing() {
      let element = this.$refs.header[this.openPanelTab];
      let name = "grey";
      if (this.darkeningGeneral) {
        name = "darkThemeBackgroundExpand";
      } else {
        name = "lightThemeBackgroundExpand";
      }
      if (this.editing) {
        let arr = element.className.split(" ");
        if (arr.indexOf(name) == -1) {
          element.className += " " + name;
        }
      }
    }
  }
</script>

<style scoped>
  .lightThemeBackgroundExpand {
    background-color: #cccccc;
  }

  .darkThemeBackgroundExpand {
    background-color: #000000;
  }
</style>
