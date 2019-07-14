<template>
  <v-layout id="root">
    <!-- this component shows all scenarios and can also show scenarios of a single system -->
    <v-flex>
      <v-card :dark="darkeningGeneral">
        <v-card-text :dark="darkeningGeneral">
          <v-container grid-list-md>
            <v-layout row wrap>
              <v-btn @click="toAddScenario()">
                <v-icon>add_circle</v-icon>
                {{strings.scenarioOverviewToAddScenario}}
              </v-btn>
            </v-layout>
            <v-card-title>
              <v-select
                :items="systemNames"
                :label="'Choose your system'"
                :placeholder="'System'"
                v-model="systemName"
              ></v-select>
              <v-spacer></v-spacer>
              <v-text-field :label="strings.systemOverviewSearch" append-icon="search"
                            hide-details single-line style="margin-top: -16px"
                            v-model="searchTable"></v-text-field>
            </v-card-title>
            <v-data-table :headers="headerTable" :items="scenariosBySystem" :loading="loadData"
                          :search="searchTable">
              <v-progress-linear color="blue" indeterminate slot="progress"
                                 v-show="loadData"></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td class="text-xs-left tableData">
                                    <span
                                      @click="toDetails(props.item._id, props.item, props.item.changes, props.item.system)">{{ props.item.name }}</span>
                </td>
                <td class="text-xs-left tableData">{{ props.item.system.name }}</td>
                <td class="text-xs-left tableData">{{ props.item.description }}</td>
                <td class="text-xs-left tableData">
                  <v-layout :key="index" row v-for="(tags, index) in props.item.tags" wrap>{{tags}}
                  </v-layout>
                </td>
                <td class="text-xs-left tableData">{{ props.item.changes.length }}</td>
                <td class="text-xs-left tableData">
                  <v-icon
                    @click="editScenario(props.item._id, props.item, props.item.changes, props.item.system)"
                    class="mr-2"
                    small>
                    edit
                  </v-icon>
                  <v-icon @click="openDialog(props.item._id, props.item.name)" small>delete</v-icon>
                </td>
              </template>
              <v-alert
                :value="true"
                color="error"
                icon="warning"
                slot="no-results"
              >{{strings.systemOverviewSearchNoResultPre}} "{{ searchTable }}"
                {{strings.systemOverviewSearchNoResultPost}}
              </v-alert>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
      <CDeleteDialog :component="scenario.name" :dialog="deletionDialog" :id="scenario._id"
                     v-on:closed-Dialog="closeDialog" v-on:delete-System="deleteScenario"></CDeleteDialog>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Watch} from "vue-property-decorator";
  import IChangeAndRipple from "../../model/IChangeAndRipple";
  import IScenario from "../../model/IScenario";
  import IService from "../../model/IService";
  import ISystem from "../../model/ISystem";
  import {ScenarioRestClient} from "../../model/ScenarioRestClient";
  import {SystemRestClient} from "../../model/SystemRestClient";
  import {AppStore, StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";
  import CDeleteDialog from "../general/CDeleteDialog.vue";

  @Component({
    components: {
      CDeleteDialog
    }
  })
  export default class RScenarioOverview extends Vue {
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
    public loadData: boolean;

    @VueStateField(StateModule.SCENARIO)
    public editingScenario: boolean;

    @VueStateField(StateModule.SYSTEM)
    public systemName: string;

    public systemNames: Array<String> = [];
    public systems: ISystem[] = [];
    public scenarios: IScenario[] = [];
    public scenariosBySystem: IScenario[] = [];
    public services: IService[] = [];

    public searchTable: any = "";

    public scenario: IScenario = {name: "", _id: ""} as IScenario;
    public deletionDialog: boolean = false;

    public headerTable: any = [
      {text: "", align: "left", sortable: true, value: "name"},
      {text: "", align: "left", sortable: true, value: "system.name"},
      {text: "", align: "left", sortable: false, value: "description"},
      {text: "", align: "left", sortable: true, value: "tags"},
      {text: "", align: "left", sortable: true, value: "changes.length"},
      {text: "", align: "left", sortable: false, value: "actions"}
    ];

    /**
     * this method is called when the html part was build. It initialize the header of the table and get all systems
     * and scenarios from the backend
     */
    public async mounted() {
      await this.init();
      this.headerTable = [
        {
          text: this.strings.scenarioOverviewName,
          align: "left",
          sortable: true,
          value: "name"
        },
        {
          text: this.strings.scenarioOverviewSystem,
          align: "left",
          sortable: true,
          value: "system.name"
        },
        {
          text: this.strings.scenarioOverviewDetails,
          align: "left",
          sortable: false,
          value: "description"
        },
        {
          text: this.strings.scenarioOverviewCategory,
          align: "left",
          sortable: true,
          value: "tags"
        },
        {
          text: this.strings.scenarioOverviewChanges,
          align: "left",
          sortable: true,
          value: "changes.length"
        },
        {
          text: this.strings.scenarioOverviewActions,
          align: "left",
          sortable: false,
          value: "actions"
        }
      ];
    }

    /**
     * this method get all systems and scenarios from the backend
     */
    public async init() {
      this.loadData = true;
      this.systems = await SystemRestClient.getSystems();
      this.scenarios = await ScenarioRestClient.getScenarios();
      for (let i = 0; i < this.systems.length; i++) {
        this.systemNames.push(this.systems[i].name);
      }
      this.systemNames.push(this.strings.evaluationNoSystem);
      this.sortScenariosBySystemName();
      // noinspection TypeScriptUnresolvedVariable
      if (this.$route.params.id !== undefined) {
        // noinspection TypeScriptUnresolvedVariable
        let index = this.systems.findIndex(
          system => system._id === this.$route.params.id
        );
        this.systemName = this.systems[index].name;
      }
      this.loadData = false;
    }

    /**
     * this method delete a scenario
     */
    public deleteScenario(id: string) {
      let self = this;
      ScenarioRestClient.deleteScenario(id).then(() => {
        self.error = self.strings.scenarioOverviewSuccessDelete;
        setTimeout(function () {
          self.error = "";
        }, self.timeout);
        this.init();
      });
    }

    /**
     * this method set the chosen scenario and its associated system in the AppStore and navigate to the RAddScenario
     * component
     */
    public editScenario(id, scenario, changes, system) {
      this.editingScenario = true;
      let totalSystem: ISystem = this.getTotalSystem(system);
      this.setEditChangesToAppStore(changes, totalSystem);
      this.setEditAppStoreData(totalSystem, scenario);
      this.$router.push("/scenarios/" + scenario._id + "/edit");
      this.$router.replace("/scenarios/" + scenario._id + "/edit");
    }

    /**
     * this method get the whole system of a selected scenario
     */
    public getTotalSystem(system) {
      let index = this.systems.findIndex(sys => sys._id === system._id);
      return this.systems[index];
    }

    /**
     * this method set the changes of a selected scenario to the AppStore
     */
    public setEditChangesToAppStore(changes, totalSystem) {
      let index: number = 0;
      let services: IService[] = [];
      for (let i = 0; i < changes.length; i++) {
        for (let j = 0; j < changes[i].ripples.length; j++) {
          index = totalSystem.services.findIndex(
            serviceSystem => serviceSystem._id === changes[i].ripples[j]
          );
          services.push(totalSystem.services[index]);
        }
        AppStore.commit("addChangeAdvanced", {
          change: changes[i],
          ripples: services
        } as IChangeAndRipple);
        services = [];
      }
    }

    /**
     * this method set the AppStore with a system and scenario for editing and for the details
     */
    public setEditAppStoreData(totalSystem, scenario) {
      AppStore.commit("setCompleteSystem", totalSystem);
      AppStore.commit("setScenarioDetails", scenario);
      AppStore.commit("setServiceNames", totalSystem.services);
    }

    /**
     * this method navigate to the RAddScenario component
     */
    public toAddScenario() {
      this.$router.push("/add-scenario");
      this.$router.replace("/add-scenario");
    }

    /**
     * this method set the scenario and system in the AppStore and navigate to the RScenarioDetails component
     */
    public toDetails(id, scenario, changes, system) {
      this.$router.push("/scenarios/" + scenario._id);
      this.$router.replace("/scenarios/" + scenario._id);
    }

    /**
     * this method opens the deletion dialog
     * @param id
     * @param name
     */
    public openDialog(id, name) {
      this.scenario._id = id;
      this.scenario.name = name;
      this.deletionDialog = true;
    }

    /**
     * this method set the variable that opens the dialog to false, so the dialog can be reopened
     * @param dialog
     */
    public closeDialog(dialog) {
      this.deletionDialog = dialog;
    }

    /**
     * once the selected system changes, show only scenarios for the selected system
     * @private
     */
    @Watch("systemName")
    public __sortScenariosBySystemName() {
      this.sortScenariosBySystemName();
    }

    /**
     * set the scenarios for the selected system
     */
    public sortScenariosBySystemName() {
      this.scenariosBySystem = [];
      if (this.systemName === "" || this.systemName === this.strings.evaluationNoSystem || this.systemName === undefined) {
        this.scenariosBySystem = this.scenarios;
        this.$router.replace("/scenarios/");
      } else {
        for (let i = 0; i < this.scenarios.length; i++) {
          if (this.scenarios[i].system.name === this.systemName) {
            this.scenariosBySystem.push(this.scenarios[i]);
          }
        }
        let index = this.systems.findIndex(
          system => system.name === this.systemName
        );
        this.$router.replace("/scenarios/" + this.systems[index]._id + "/overview");
      }
    }

    /**
     * reset the system name, if no system is selected
     */
    public beforeDestroy() {
      if (this.systemName === this.strings.evaluationNoSystem) {
        this.systemName = "";
      }
    }
  }
</script>

<style scoped>
  #root {
    min-height: 100vh;
    height: 100%;
  }

  .tableData {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  span {
    color: dodgerblue;
  }

  span:hover {
    text-decoration: underline;
    cursor: pointer;
  }
</style>
