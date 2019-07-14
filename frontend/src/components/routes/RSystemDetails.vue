<template>
  <v-layout id="root">
    <!-- this component shows the details of a system and its services in the form of a table. This component also
     shows a graph of the system as well as all scenarios for the system -->
    <v-flex>
      <v-card :dark="darkeningGeneral">
        <v-card-text :dark="darkeningGeneral">
          <v-container grid-list-md>
            <v-layout row v-if="!loadData" wrap>
              <v-flex>
                <v-layout row wrap>
                  <h2>{{appStore.state.system.name}}</h2>
                </v-layout>
                <v-layout row wrap>
                  <h5>{{appStore.state.system.description}}</h5>
                </v-layout>
                <v-layout row wrap>
                  <v-flex md6 order-md1 order-sm1 sm12 xs12>
                    <v-card-title>
                      <v-layout row wrap>
                        <v-flex>
                          <v-btn @click="goBackToOverview()">{{strings.systemDetailBack}}
                          </v-btn>
                        </v-flex>
                        <v-flex>
                          <v-btn @click="goToEdit(appStore.state.system._id)">
                            {{strings.systemDetailGoToEdit}}
                          </v-btn>
                        </v-flex>
                        <v-flex>
                          <v-btn @click="goToEvaluation(appStore.state.system.name)">
                            {{strings.systemDetailGoToEvaluation}}
                          </v-btn>
                        </v-flex>
                      </v-layout>
                      <v-spacer></v-spacer>
                      <v-text-field :label="strings.systemOverviewSearch" append-icon="search"
                                    hide-details single-line
                                    v-model="searchTable"></v-text-field>
                    </v-card-title>
                    <v-data-table :headers="headerTable" :items="appStore.state.services"
                                  :search="searchTable">
                      <template slot="items" slot-scope="props">
                        <td class="text-xs-left tableData">{{ props.item.name }}</td>
                        <td class="text-xs-left tableData">{{ props.item.description }}</td>
                        <td class="text-xs-left tableData">
                          <v-layout :key="index" row
                                    v-for="(associatedService, index) in props.item.associations"
                                    wrap>{{associatedService}}
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
                  <v-flex md6 order-md4 order-sm4 sm12 xs12>
                    <CGraphOfSystem :services="appStore.state.services"></CGraphOfSystem>
                  </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <h2 style="margin-top: 25px">Scenarios</h2>
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-text-field :label="strings.systemOverviewSearch" append-icon="search"
                                hide-details single-line
                                v-model="searchTableScenarios"></v-text-field>
                </v-card-title>
                <v-data-table :headers="headerTableScenarios" :items="scenarios"
                              :loading="loadData" :search="searchTableScenarios">
                  <v-progress-linear color="blue" indeterminate slot="progress"
                                     v-show="loadData"></v-progress-linear>
                  <template slot="items" slot-scope="props">
                    <td class="text-xs-left tableData">
                                            <span
                                              @click="goScenarioDetails(props.item._id)">{{ props.item.name }}</span>
                    </td>
                    <td class="text-xs-left tableData">{{ props.item.description }}</td>
                    <td class="text-xs-left tableData">{{ props.item.category }}</td>
                    <td class="text-xs-left tableData">{{ props.item.changes.length }}</td>
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
  import IScenario from "../../model/IScenario";
  import {ScenarioRestClient} from "../../model/ScenarioRestClient";
  import {SystemRestClient} from "../../model/SystemRestClient";
  import {AppStore, StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";
  import CGraphOfSystem from "../general/CGraphOfSystem.vue";

  @Component({
    components: {
      CGraphOfSystem
    }
  })
  export default class RSystemDetails extends Vue {
    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @VueStateField(StateModule.GENERAL)
    public loadData: boolean;

    @VueStateField(StateModule.SYSTEM)
    public systemName: string;

    public appStore: any = AppStore;

    public headerTable: any = [
      {text: "", align: "left", sortable: true, value: "name"},
      {text: "", align: "left", sortable: false, value: "description"},
      {text: "", align: "left", sortable: false, value: "dependencies"}
    ];

    public headerTableScenarios: any = [
      {text: "", align: "left", sortable: true, value: "name"},
      {text: "", align: "left", sortable: false, value: "description"},
      {text: "", align: "left", sortable: true, value: "category"},
      {text: "", align: "left", sortable: true, value: "changes.length"}
    ];

    public searchTable: string = "";
    public searchTableScenarios: string = "";

    public scenarios: IScenario[] = Array<IScenario>();

    /**
     * this method initialise the header of the table
     */
    public async mounted() {
      this.headerTable = [
        {
          text: this.strings.systemDetailService,
          align: "left",
          sortable: true,
          value: "name"
        },
        {
          text: this.strings.systemDetailServiceDescription,
          align: "left",
          sortable: false,
          value: "description"
        },
        {
          text: this.strings.systemDetailServiceAssociated,
          align: "left",
          sortable: false,
          value: "dependencies"
        }
      ];
      this.headerTableScenarios = [
        {
          text: this.strings.scenarioOverviewName,
          align: "left",
          sortable: true,
          value: "name"
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
          value: "category"
        },
        {
          text: this.strings.scenarioOverviewChanges,
          align: "left",
          sortable: true,
          value: "changes.length"
        }
      ];
      if (
        AppStore.state.system._id === "" ||
        AppStore.state.system._id === undefined
      ) {
        await this.init();
      }
      this.scenarios = await ScenarioRestClient.getScenarios(
        AppStore.state.system._id
      );
    }

    /**
     * this method initialize the data for the system and put it in the vuex store
     */
    public async init() {
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

    /**
     * this method puts the before gotten data in the vuex store
     */
    public setDetails(id, name, description, services, system) {
      this.setEditAppStoreData(name, id, description, system);
      if (services !== undefined) {
        AppStore.commit("setServices", services);
      }
    }

    /**
     * set all data in the vuex store
     */
    public setEditAppStoreData(name, id, description, system) {
      AppStore.commit("setCompleteSystem", system);
      AppStore.commit("setSystemName", name);
      AppStore.commit("setSystemID", id);
      AppStore.commit("setSystemDescription", description);
    }

    /**
     * this method navigate to the system overview
     */
    public goBackToOverview() {
      this.$router.push("/systems");
      this.$router.replace("/systems");
    }

    /**
     * this method navigates to the details of a scenario
     */
    public goScenarioDetails(id) {
      this.$router.push("/scenarios/" + id);
      this.$router.replace("/scenarios/" + id);
    }

    /**
     * this method navigates to edit system
     */
    public goToEdit(id) {
      this.$router.push("/systems/" + id + "/edit");
      this.$router.replace("/systems/" + id + "/edit");
    }

    /**
     * this method navigates to the evaluation view
     */
    public goToEvaluation(name) {
      this.systemName = name;
      this.$router.push("/evaluation/");
      this.$router.replace("/evaluation/");
    }

    /**
     * reset the AppStore after this component is destroyed
     */
    public beforeDestroy() {
      AppStore.commit("resetSystem");
      AppStore.commit("resetService");
      AppStore.commit("resetServices");
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
