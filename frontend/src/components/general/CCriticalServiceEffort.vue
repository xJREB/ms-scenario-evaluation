<template>
  <v-layout row wrap>
    <!-- this component sets the text for the critical service with the highest effort and lowest effort-->
    <v-flex>
      <v-layout row wrap>
        <v-flex pa-1 shrink>
          <span class="putRight">{{strings.evaluationCriticalServiceEffort}}</span>
        </v-flex>
        <v-flex grow pa-1>{{criticalService.name + " with an effort of " + criticalService.effort}}</v-flex>
      </v-layout>
      <v-divider></v-divider>
      <v-layout row wrap>
        <v-flex pa-1 shrink>
          <span class="putRight">{{strings.evaluationCriticalServiceEffortLowest}}</span>
        </v-flex>
        <v-flex grow pa-1>{{criticalServiceLowest.name + " with an effort of " +
          criticalServiceLowest.effort}}
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop, Watch} from "vue-property-decorator";
  import IEvaluationSystem from "../../model/IEvaluationSystem";
  import {StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";

  export interface IResultCriticalService {
    serviceHighestEffort: string;
    serviceLowestEffort: string;
    serviceHighestEffortNumber: string;
    serviceLowestEffortNumber: string;
  }

  @Component({
    components: {}
  })
  export default class CCriticalServiceEffort extends Vue {
    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @VueStateField(StateModule.GENERAL)
    public design: number;

    public criticalService: any = {name: "", effort: 0};
    public criticalServiceLowest: any = {name: "", effort: 0};

    @Prop() public evaluationSystem: IEvaluationSystem;

    /**
     * when the effort estimation method changes then the critical service is adjusted
     * @private
     */
    @Watch("design")
    public __design() {
      this.setCriticalServiceHighestAndLowest();
    }

    /**
     * the scenarios needs to be watched to recalculate the critical service once the selected system changes
     * @private
     */
    @Watch("evaluationSystem.scenarios")
    public __scenarios() {
      this.setCriticalServiceHighestAndLowest();
    }

    /**
     * this method set the critical service with the highest and lowest effort according to what effort estimation
     * method is selected
     */
    public setCriticalServiceHighestAndLowest() {
      if (
        this.evaluationSystem.systemName !== "" &&
        this.evaluationSystem.systemName !== this.strings.evaluationNoSystem
      ) {
        if (this.design === 1) {
          if (this.evaluationSystem.criticalServiceEffortHours !== undefined) {
            if (this.evaluationSystem.criticalServiceEffortHours.serviceHighestEffortNumber !== undefined
              && this.evaluationSystem.criticalServiceEffortHours.serviceLowestEffortNumber !== undefined) {
              this.criticalService = {
                name: this.evaluationSystem.criticalServiceEffortHours.serviceHighestEffort,
                effort: this.evaluationSystem.criticalServiceEffortHours.serviceHighestEffortNumber.toString() + " hours"
              };
              this.criticalServiceLowest = {
                name: this.evaluationSystem.criticalServiceEffortHours.serviceLowestEffort,
                effort: this.evaluationSystem.criticalServiceEffortHours.serviceLowestEffortNumber.toString() + " hours"
              };
            }
          }
        }
        if (this.design === 2) {
          if (this.evaluationSystem.criticalServiceEffortOrdinal !== undefined) {
            if (this.evaluationSystem.criticalServiceEffortOrdinal.serviceHighestEffortNumber !== undefined
              && this.evaluationSystem.criticalServiceEffortOrdinal.serviceLowestEffortNumber !== undefined) {
              this.criticalService = {
                name: this.evaluationSystem.criticalServiceEffortOrdinal.serviceHighestEffort,
                effort: this.evaluationSystem.criticalServiceEffortOrdinal.serviceHighestEffortNumber.toString()
              };
              this.criticalServiceLowest = {
                name: this.evaluationSystem.criticalServiceEffortOrdinal.serviceLowestEffort,
                effort: this.evaluationSystem.criticalServiceEffortOrdinal.serviceLowestEffortNumber.toString()
              };
            }
          }
        }
        if (this.design === 4) {
          if (this.evaluationSystem.criticalServiceEffortCosmic !== undefined) {
            if (this.evaluationSystem.criticalServiceEffortCosmic.serviceHighestEffortNumber !== undefined
              && this.evaluationSystem.criticalServiceEffortCosmic.serviceLowestEffortNumber !== undefined) {
              this.criticalService = {
                name: this.evaluationSystem.criticalServiceEffortCosmic.serviceHighestEffort,
                effort: this.evaluationSystem.criticalServiceEffortCosmic.serviceHighestEffortNumber.toString()
                  + " Cosmic function points"
              };
              this.criticalServiceLowest = {
                name: this.evaluationSystem.criticalServiceEffortCosmic.serviceLowestEffort,
                effort: this.evaluationSystem.criticalServiceEffortCosmic.serviceLowestEffortNumber.toString()
                  + " Cosmic function points"
              };
            }
          }
        }
        if (this.design === 5) {
          if (this.evaluationSystem.criticalServiceEffortStory !== undefined) {
            if (this.evaluationSystem.criticalServiceEffortStory.serviceHighestEffortNumber !== undefined
              && this.evaluationSystem.criticalServiceEffortStory.serviceLowestEffortNumber !== undefined) {
              this.criticalService = {
                name: this.evaluationSystem.criticalServiceEffortStory.serviceHighestEffort,
                effort: this.evaluationSystem.criticalServiceEffortStory.serviceHighestEffortNumber.toString()
                  + " Story points"
              };
              this.criticalServiceLowest = {
                name: this.evaluationSystem.criticalServiceEffortStory.serviceLowestEffort,
                effort: this.evaluationSystem.criticalServiceEffortStory.serviceLowestEffortNumber.toString()
                  + " Story points"
              };
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  .putRight {
    padding-left: 4px;
  }
</style>
