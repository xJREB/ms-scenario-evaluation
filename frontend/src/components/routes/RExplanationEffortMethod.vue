<template>
  <v-layout id="root">
    <!-- this component shows the explanation of the effort estimation methods -->
    <v-flex>
      <v-card :dark="darkeningGeneral">
        <v-card-text :dark="darkeningGeneral">
          <v-container grid-list-md>
            <h2>{{strings.explanationHeaderExplanation}}</h2>
            <span>{{strings.explanationGeneral}}</span><br/><br/>
            <h4>{{strings.explanationHeaderHours}}</h4>
            <span>{{strings.explanationHours}}</span><br/><br/>
            <h4>{{strings.explanationHeaderOrdinalScale}}</h4>
            <span>{{strings.explanationOrdinalScale}}</span><br/><br/>
            <h4>{{strings.explanationHeaderCosmic}}</h4>
            <span>{{strings.explanationCosmicFirst}}</span>
            <a href="https://cosmic-sizing.org/cosmic-fsm">{{strings.explanationCosmicInformationFound}}</a><br/>
            <span>{{strings.explanationCosmicSecond}}</span><br/><br/>
            <h4>{{strings.explanationHeaderStoryPoints}}</h4>
            <span>{{strings.explanationStoryPointsFirst}}</span>
            <a href="https://www.mountaingoatsoftware.com/blog/what-are-story-points">{{strings.explanationStoryPointsMethod}}</a><br/>
            <span>{{strings.explanationStoryPointsSecond}}</span>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";

  @Component
  export default class RExplanationEffortMethod extends Vue {
    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @VueStateField(StateModule.GENERAL)
    public strings: any;
  }
</script>

<style scoped>
  #root {
    min-height: 100vh;
    height: 100%;
  }

  .imageWrapperLight {
    background: url("../../assets/Tax.png");
    height: 278px;
    width: 484px;
    overflow: auto;
    margin: 0 auto;
    white-space: nowrap
  }

  .imageWrapperDark {
    background: url("../../assets/TaxDark.png");
    height: 281px;
    width: 487px;
    overflow: auto;
    margin: 0 auto;
    white-space: nowrap
  }
</style>
