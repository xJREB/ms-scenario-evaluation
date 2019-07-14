<template>
  <v-layout row wrap>
    <!-- this component create a pie chart that displays the effort distribution of all services -->
    <GChart
      :data="chartData"
      :options="chartOptions"
      class="scrollTrick"
      type="PieChart"
    />
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop, Watch} from "vue-property-decorator";
  import IEvaluationSystem from "../../model/IEvaluationSystem";
  import {StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";

  @Component({
    components: {}
  })
  export default class CPieChartServicesEffort extends Vue {
    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @VueStateField(StateModule.SYSTEM)
    public systemName: string;

    public chartData: any = [];
    public chartOptions: any = {
      title: "",
      subtitle: "",
      width: 600,
      height: 300,
      backgroundColor: "#474747",
      titleTextStyle: {
        color: "#FFFFFF",
        fontSize: 18
      },
      legend: {
        textStyle: {
          color: "#FFFFFF"
        }
      }
    };

    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @VueStateField(StateModule.GENERAL)
    public design: number;

    @Prop() public evaluationSystem: IEvaluationSystem;

    /**
     * this method adjust the distribution when the effort estimation method changes
     * @private
     */
    @Watch("design")
    public __design() {
      this.chartOptions.title = "Services and their effort";
      this.setChartDataAccordingToDesign();
    }

    /**
     * when the selected system changes, then recreate the graph according to the theme
     * @private
     */
    @Watch("evaluationSystem.scenarios")
    public __scenarios() {
      if (
        this.evaluationSystem.systemName !== "" &&
        this.evaluationSystem.systemName !== this.strings.evaluationNoSystem
      ) {
        if (!this.darkeningGeneral) {
          this.chartOptions.titleTextStyle.color = "#000000";
          this.chartOptions.legend.textStyle.color = "#000000";
          this.chartOptions.backgroundColor = "#FFFFFF";
        }
        this.chartOptions.title = "Services and their effort";
        this.setChartDataAccordingToDesign();
      }
    }

    /**
     * adjust the pie chart according to the theme
     * @private
     */
    @Watch("darkeningGeneral")
    public __darkening() {
      if (!this.darkeningGeneral) {
        if (!this.darkeningGeneral) {
          this.chartOptions.titleTextStyle.color = "#000000";
          this.chartOptions.legend.textStyle.color = "#000000";
          this.chartOptions.backgroundColor = "#FFFFFF";
        }
      } else {
        this.chartOptions.titleTextStyle.color = "#FFFFFF";
        this.chartOptions.legend.textStyle.color = "#FFFFFF";
        this.chartOptions.backgroundColor = "#474747";
      }
    }

    /**
     * this method set the chartData according to what effort estimation method is selected
     */
    public setChartDataAccordingToDesign() {
      if (this.design === 1) {
        if (this.evaluationSystem.criticalServiceEffortHours !== undefined) {
          this.chartData = this.evaluationSystem.criticalServiceEffortHours.servicesEffortArray;
        }
      }
      if (this.design === 2) {
        if (this.evaluationSystem.criticalServiceEffortOrdinal !== undefined) {
          this.chartData = this.evaluationSystem.criticalServiceEffortOrdinal.servicesEffortArray;
        }
      }
      if (this.design === 4) {
        if (this.evaluationSystem.criticalServiceEffortCosmic !== undefined) {
          this.chartData = this.evaluationSystem.criticalServiceEffortCosmic.servicesEffortArray;
        }
      }
      if (this.design === 5) {
        if (this.evaluationSystem.criticalServiceEffortStory !== undefined) {
          this.chartData = this.evaluationSystem.criticalServiceEffortStory.servicesEffortArray;
        }
      }
    }
  }
</script>

<style scoped>
  .scrollTrick {
    overflow: auto;
    overflow-y: hidden;
    margin: 0 auto;
    white-space: nowrap
  }
</style>
