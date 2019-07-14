<template>
  <v-layout row wrap>
    <!-- this component create a pie chart for the service distribution that changes -->
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
  export default class CPieChartServicesChangesDistribution extends Vue {
    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

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

    @Prop() public evaluationSystem: IEvaluationSystem;

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
        this.chartOptions.title = "Services and how often they are affected by changes and their ripples";
        this.chartData = this.evaluationSystem.pieChartArrayServicesChangeMost;
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
