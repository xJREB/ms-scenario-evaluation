<template>
  <v-layout id="root">
    <!-- this component shows the details of a scenario in form of a table of its changes -->
    <v-flex>
      <v-card :dark="darkeningGeneral">
        <v-card-text :dark="darkeningGeneral">
          <v-container grid-list-md>
            <v-layout row v-if="!loadData" wrap>
              <v-flex>
                <v-layout row wrap>
                  <h2>{{appStore.state.scenario.name}}</h2>
                </v-layout>
                <v-layout>
                  <h5>{{appStore.state.scenario.description}}</h5>
                </v-layout>
                <v-card-title>
                  <v-layout row wrap>
                    <v-flex>
                      <v-btn @click="goBackToOverview()">{{strings.systemDetailBack}}</v-btn>
                    </v-flex>
                    <v-flex>
                      <v-btn @click="goToEdit(appStore.state.scenario._id)">
                        {{strings.scenarioDetailGoToEdit}}
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-spacer></v-spacer>
                  <v-text-field :label="strings.systemOverviewSearch" append-icon="search"
                                hide-details single-line
                                v-model="searchTable"></v-text-field>
                </v-card-title>
                <v-data-table :headers="headerTable" :items="advancedChanges" :search="searchTable">
                  <template slot="items" slot-scope="props">
                    <td class="text-xs-left tableData">{{ props.item.type }}</td>
                    <td class="text-xs-left tableData">{{ props.item.description }}</td>
                    <td class="text-xs-left tableData">
                      <v-layout row v-show="design === 1" wrap>{{ props.item.effort
                        }}{{strings.evaluationHours}}
                      </v-layout>
                      <v-layout row v-show="design === 2" wrap>{{ props.item.effort }}</v-layout>
                      <v-layout row v-show="design === 3" wrap>
                        <v-flex>
                          <v-layout row wrap>{{ props.item.effort }}
                            {{strings.evaluationLinesOfCode}}
                          </v-layout>
                          <v-layout row wrap>{{ props.item.effortHours }}
                            {{strings.evaluationHours}}
                          </v-layout>
                        </v-flex>
                      </v-layout>
                      <v-layout row v-show="design === 4" wrap>{{ props.item.effort
                        }}{{strings.evaluationCosmicPoints}}
                      </v-layout>
                      <v-layout row v-show="design === 5" wrap>{{ props.item.effort
                        }}{{strings.evaluationStoryPoints}}
                      </v-layout>
                    </td>
                    <td class="text-xs-left tableData">{{ props.item.service.name }}</td>
                    <td class="text-xs-left tableData">
                      <v-layout :key="index" row v-for="(ripple, index) in props.item.ripples"
                                wrap>{{ripple.name}}
                      </v-layout>
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
              </v-flex>
            </v-layout>
            <v-layout row v-else wrap>
              <v-label :dark="darkeningGeneral">{{strings.loading}}</v-label>
              <br>
              <v-progress-linear :indeterminate="true"></v-progress-linear>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Watch} from "vue-property-decorator";
  import IChange from "../../model/IChange";
  import IChangeAndRipple from "../../model/IChangeAndRipple";
  import IScenario from "../../model/IScenario";
  import IService from "../../model/IService";
  import ISystem from "../../model/ISystem";
  import {ScenarioRestClient} from "../../model/ScenarioRestClient";
  import {SystemRestClient} from "../../model/SystemRestClient";
  import {AppStore, StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";

  export interface IAdvancedChange {
    type: string;
    description: string;
    effort: number;
    effortHours: number;
    service: IService;
    ripples: IService[];
  }

  @Component({
    components: {}
  })
  export default class RScenarioDetails extends Vue {
    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @VueStateField(StateModule.GENERAL)
    public design: number;

    @VueStateField(StateModule.GENERAL)
    public loadData: boolean;

    public appStore: any = AppStore;

    public headerTable: any = [
      {text: "", align: "left", sortable: true, value: "type"},
      {text: "", align: "left", sortable: false, value: "description"},
      {text: "", align: "left", sortable: true, value: "effort"},
      {text: "", align: "left", sortable: true, value: "service.name"},
      {text: "", align: "left", sortable: false, value: "ripples.name"}
    ];

    public advancedChanges: IAdvancedChange[] = [];

    public searchTable: string = "";

    /**
     * set the table header
     */
    public async mounted() {
      this.headerTable = [
        {
          text: this.strings.scenarioDetailType,
          align: "left",
          sortable: true,
          value: "type"
        },
        {
          text: this.strings.scenarioDetailDescription,
          align: "left",
          sortable: false,
          value: "description"
        },
        {
          text: this.strings.scenarioDetailEffort,
          align: "left",
          sortable: true,
          value: "effort"
        },
        {
          text: this.strings.scenarioDetailAffectedService,
          align: "left",
          sortable: true,
          value: "service.name"
        },
        {
          text: this.strings.scenarioDetailRipples,
          align: "left",
          sortable: false,
          value: "ripples.name"
        }
      ];
      await this.init();
    }

    /**
     * initialize the data of a scenario
     */
    public async init() {
      this.loadData = true;
      // noinspection TypeScriptUnresolvedVariable
      let scenario: IScenario = await ScenarioRestClient.getScenario(
        this.$route.params.id
      );
      let systemID = scenario.system.toString();
      let system = await SystemRestClient.getSystemById(systemID);
      let changes = await ScenarioRestClient.getChanges(scenario._id);
      for (let i = 0; i < changes.length; i++) {
        this.advancedChanges.push({
          type: changes[i].type,
          description: changes[i].description,
          effort: 0,
          effortHours: changes[i].effortHours,
          service: changes[i].service,
          ripples: changes[i].ripples
        });
      }
      this.setDetails(scenario, system, changes);
      this.setEffortByDesign();
      this.loadData = false;
    }

    /**
     * this method sets the effort of a change according to what effort estimation method is selected
     */
    public setEffortByDesign() {
      for (let i = 0; i < AppStore.state.changes.length; i++) {
        if (this.design === 1) {
          this.advancedChanges[i].effort = AppStore.state.changes[i].effortHours;
        }
        if (this.design === 2) {
          this.advancedChanges[i].effort =
            AppStore.state.changes[i].effortOrdinal;
        }
        if (this.design === 4) {
          this.advancedChanges[i].effort =
            AppStore.state.changes[i].effortCosmicFunctionPoints;
        }
        if (this.design === 5) {
          this.advancedChanges[i].effort =
            AppStore.state.changes[i].effortStoryPoints;
        }
      }
    }

    /**
     * this method sets the scenario details in the vuex store
     */
    public setDetails(scenario: IScenario, system: ISystem, changes: IChange[]) {
      this.setEditChangesToAppStore(changes, system);
      this.setEditAppStoreData(system, scenario);
      AppStore.commit("setScenarioDetailsDetail");
    }

    /**
     * this method sets the changes in the vuex store
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

        let affectedServiceID = changes[i].service;
        index = totalSystem.services.findIndex(
          service => service._id === affectedServiceID
        );
        changes[i].service = totalSystem.services[index];
        this.advancedChanges[i].service = totalSystem.services[index];
        this.advancedChanges[i].ripples = services;

        AppStore.commit("addChangeAdvanced", {
          change: changes[i],
          ripples: services
        } as IChangeAndRipple);
        services = [];
      }
    }

    /**
     * this method sets the system, services and scenario in the vuex store
     */
    public setEditAppStoreData(totalSystem, scenario) {
      AppStore.commit("setCompleteSystem", totalSystem);
      AppStore.commit("setScenarioDetails", scenario);
      AppStore.commit("setServiceNames", totalSystem.services);
    }

    /**
     * this method navigate to the system overview
     */
    public goBackToOverview() {
      this.$router.push("/scenarios");
      this.$router.replace("/scenarios");
    }

    /**
     * this method routes the user to edit the scenario (REditScenario)
     * @param id
     */
    public goToEdit(id) {
      this.$router.push("/scenarios/" + id + "/edit");
      this.$router.replace("/scenarios/" + id + "/edit");
    }

    /**
     * once the effort estimation method changes, the effort of the shown changes is adjusted
     * @private
     */
    @Watch("design")
    public __design() {
      this.setEffortByDesign();
    }

    /**
     * reset the vuex store
     */
    public beforeDestroy() {
      AppStore.commit("resetSystem");
      AppStore.commit("resetService");
      AppStore.commit("resetServices");
      AppStore.commit("resetScenario");
      AppStore.commit("resetSystemNames");
      AppStore.commit("resetChanges");
      AppStore.commit("resetChange");
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
</style>
