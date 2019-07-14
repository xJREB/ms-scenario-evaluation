<template>
  <v-layout row wrap>
    <!-- this component is the table for the evaluation of single scenarios -->
    <v-layout row style="margin-top: 25px" wrap>
      <h2>Information about individual scenarios</h2>
    </v-layout>
    <v-card :dark="darkeningGeneral" style="width: 100%">
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field :label="strings.systemOverviewSearch" append-icon="search" hide-details
                      single-line v-model="searchTable"></v-text-field>
      </v-card-title>
      <v-data-table :headers="headerTable" :items="advancedScenarios" :loading="loadData" :search="searchTable">
        <v-progress-linear color="blue" indeterminate slot="progress"></v-progress-linear>
        <template slot="items" slot-scope="props">
          <td class="text-xs-left tableData">{{ props.item.name }}</td>
          <td class="text-xs-left tableData">{{ props.item.changesLength }}</td>
          <td class="text-xs-left tableData">{{ props.item.changesMostRipples }}</td>
          <td class="text-xs-left tableData">
            <v-layout row v-show="design === 1" wrap>{{ props.item.scenarioEffort
              }}{{strings.evaluationHours}}
            </v-layout>
            <v-layout row v-show="design === 2" wrap>{{ props.item.scenarioEffort }}</v-layout>
            <v-layout row v-show="design === 4" wrap>{{ props.item.scenarioEffort
              }}{{strings.evaluationCosmicPoints}}
            </v-layout>
            <v-layout row v-show="design === 5" wrap>{{ props.item.scenarioEffort
              }}{{strings.evaluationStoryPoints}}
            </v-layout>
          </td>
          <td class="text-xs-left tableData">{{ props.item.affectedServices }} /
            {{evaluationSystem.servicesNumber}}
          </td>
          <td class="text-xs-left tableData">
            <v-layout :key="index" row v-for="(tag, index) in props.item.tags" wrap>
              {{ tag }}
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
    </v-card>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop, Watch} from "vue-property-decorator";
  import IAdvancedScenarios from "../../model/IAdvancedScenarios";
  import IEvaluationSystem from "../../model/IEvaluationSystem";
  import {StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";
  import CCriticalServiceEffort from "./CCriticalServiceEffort.vue";
  import CPieChartServicesChangesDistribution from "./CPieChartServicesChangesDistribution.vue";
  import CPieChartServicesEffort from "./CPieChartServicesEffort.vue";

  @Component({
    components: {
      CCriticalServiceEffort,
      CPieChartServicesEffort,
      CPieChartServicesChangesDistribution
    }
  })
  export default class CEvaluationScenarioTable extends Vue {
    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @VueStateField(StateModule.GENERAL)
    public design: number;

    @VueStateField(StateModule.GENERAL)
    public loadData: boolean;

    public searchTable: string = "";
    public advancedScenarios: IAdvancedScenarios[] = [];
    public category: string = "";

    public headerTable: any = [
      {text: "Scenario", align: "left", sortable: true, value: "name"},
      {
        text: "Change Count",
        align: "left",
        sortable: true,
        value: "changesLength"
      },
      {
        text: "Most impactful change",
        align: "left",
        sortable: true,
        value: "changesMostRipples"
      },
      {
        text: "Scenarios effort",
        align: "left",
        sortable: true,
        value: "scenarioEffort"
      },
      {
        text: "# of affected services",
        align: "left",
        sortable: true,
        value: "affectedServices"
      },
      {text: "Tags", align: "left", sortable: true, value: "Tags"}
    ];

    @Prop() public systemNames: string[];
    @Prop() public evaluationSystem: IEvaluationSystem;

    /**
     * sets the header of the table once the component is ready
     */
    public mounted() {
      this.headerTable = [
        {
          text: this.strings.evaluationTableScenario,
          align: "left",
          sortable: true,
          value: "name"
        },
        {
          text: this.strings.evaluationTableChangeCount,
          align: "left",
          sortable: true,
          value: "changesLength"
        },
        {
          text: this.strings.evaluationChangeMostServices,
          align: "left",
          sortable: true,
          value: "changesMostRipples"
        },
        {
          text: this.strings.evaluationTableScenarioEffort,
          align: "left",
          sortable: true,
          value: "scenarioEffort"
        },
        {
          text: this.strings.evaluationTableServices,
          align: "left",
          sortable: true,
          value: "affectedServices"
        },
        {
          text: this.strings.evaluationTableCategory,
          align: "left",
          sortable: true,
          value: "Tags"
        }
      ];
    }

    /**
     * this method sets the data for the advanced scenarios which differs from the normal scenarios by having the affected
     * affected services as attribute
     */
    public resetAdvancedScenarios() {
      this.loadData = true;
      this.advancedScenarios = [];
      if (this.design === 1) {
        this.advancedScenarios = this.evaluationSystem.advancedScenariosHours;
      }
      if (this.design === 2) {
        this.advancedScenarios = this.evaluationSystem.advancedScenariosOrdinal;
      }
      if (this.design === 4) {
        this.advancedScenarios = this.evaluationSystem.advancedScenariosCosmic;
      }
      if (this.design === 5) {
        this.advancedScenarios = this.evaluationSystem.advancedScenariosStory;
      }
      this.loadData = false;
    }

    /**
     * this method sets the total affected service number once the scenarios from the parent change. So it is like when the selected
     * system change.
     * @private
     */
    @Watch("evaluationSystem.scenarios")
    public __scenarios() {
      if (
        this.evaluationSystem.systemName !== "" &&
        this.evaluationSystem.systemName !== this.strings.evaluationNoSystem
      ) {
        this.resetAdvancedScenarios();
      }
    }

    /**
     * once the effort estimation method changes, the scenarios need to be adjusted
     * @private
     */
    @Watch("design")
    public __design() {
      if (
        this.evaluationSystem.systemName !== "" &&
        this.evaluationSystem.systemName !== this.strings.evaluationNoSystem
      ) {
        this.resetAdvancedScenarios();
      }
    }
  }
</script>

<style scoped>
  .tableData {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
