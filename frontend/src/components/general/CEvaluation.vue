<template>
  <v-layout row style="font-size: 12pt" wrap>
    <v-flex>
      <v-layout row style="margin-bottom: 10px" wrap>
        <h2>Information about the total system</h2>
      </v-layout>
      <v-layout row wrap>
        <v-flex md6 order-md1 order-sm1 sm12 xs12>
          <CPieChartServicesEffort :evaluationSystem="evaluationSystem"></CPieChartServicesEffort>
        </v-flex>
        <v-flex md6 order-md4 order-sm4 sm12 xs12>
          <CPieChartServicesChangesDistribution
            :evaluationSystem="evaluationSystem"></CPieChartServicesChangesDistribution>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex pa-1 shrink>{{strings.evaluationCriticalServiceChangedMost}}</v-flex>
        <v-flex grow pa-1>{{evaluationSystem.criticalService.name}}</v-flex>
      </v-layout>
      <v-divider></v-divider>
      <v-layout row wrap>
        <CCriticalServiceEffort :evaluationSystem="evaluationSystem"></CCriticalServiceEffort>
      </v-layout>
      <v-divider></v-divider>
      <v-layout row wrap>
        <v-flex pa-1 shrink>{{strings.evaluationEffort}}</v-flex>
        <v-flex grow pa-1 v-show="design === 1">
          {{Math.round(evaluationSystem.effortHours * 100) / 100}} {{strings.evaluationHours}}
          <br>
        </v-flex>
        <v-flex grow pa-1 v-show="design === 2">
          {{Math.round(evaluationSystem.ordinalEffort * 100) / 100}}
          <br>
        </v-flex>
        <v-flex grow pa-1 v-show="design === 3">
          {{Math.round(evaluationSystem.linesOfCodeEffort * 100) / 100}}{{" " +
          strings.evaluationLinesOfCode}}
          <br>
          {{Math.round(evaluationSystem.effortHours * 100) / 100}} {{strings.evaluationHours}}
          <br>
        </v-flex>
        <v-flex grow pa-1 v-show="design === 4">
          {{Math.round(evaluationSystem.effortCosmic * 100) / 100}}{{strings.evaluationCosmicPoints}}
          <br>
        </v-flex>
        <v-flex grow pa-1 v-show="design === 5">
          {{Math.round(evaluationSystem.effortStoryPoints * 100) / 100}}{{strings.evaluationStoryPoints}}
          <br>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
      <v-layout row wrap>
        <v-flex pa-1 shrink>{{strings.evaluationAverageScenario}}</v-flex>
        <v-flex grow pa-1 v-show="design === 1">
          {{Math.round(evaluationSystem.effortHours / evaluationSystem.scenarios.length * 100) / 100}}{{" "
          +strings.evaluationHours}}
          <br>
        </v-flex>
        <v-flex grow pa-1 v-show="design === 2">
          {{Math.round(evaluationSystem.ordinalEffort / evaluationSystem.scenarios.length * 100) / 100}}
          <br>
        </v-flex>
        <v-flex grow pa-1 v-show="design === 4">
          {{Math.round(evaluationSystem.effortCosmic / evaluationSystem.scenarios.length * 100) / 100}}{{" "
          +strings.evaluationCosmicPoints}}
          <br>
        </v-flex>
        <v-flex grow pa-1 v-show="design === 5">
          {{Math.round(evaluationSystem.effortStoryPoints / evaluationSystem.scenarios.length * 100) /
          100}}{{" " +strings.evaluationStoryPoints}}
          <br>
        </v-flex>
      </v-layout>
    </v-flex>
    <CEvaluationScenarioTable :evaluationSystem="evaluationSystem"
                              :systemNames="systemNames"></CEvaluationScenarioTable>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop} from "vue-property-decorator";
  import IEvaluationSystem from "../../model/IEvaluationSystem";
  import {StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";
  import CCriticalServiceEffort from "./CCriticalServiceEffort.vue";
  import CEvaluationScenarioTable from "./CEvaluationScenarioTable.vue";
  import CPieChartServicesChangesDistribution from "./CPieChartServicesChangesDistribution.vue";
  import CPieChartServicesEffort from "./CPieChartServicesEffort.vue";

  @Component({
    components: {
      CCriticalServiceEffort,
      CPieChartServicesEffort,
      CPieChartServicesChangesDistribution,
      CEvaluationScenarioTable
    }
  })
  export default class CEvaluation extends Vue {
    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @VueStateField(StateModule.GENERAL)
    public design: number;

    @VueStateField(StateModule.GENERAL)
    public loadData: boolean;

    @Prop() public systemNames: string[];
    @Prop() public evaluationSystem: IEvaluationSystem;
  }
</script>

<style scoped>
</style>
