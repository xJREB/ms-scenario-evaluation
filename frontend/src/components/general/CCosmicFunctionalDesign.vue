<template>
  <v-layout row wrap>
    <!-- this component visualise the cosmic design from adding changes -->
    <v-flex>
      <v-layout row wrap>
        <v-text-field
          :label="strings.addChangeEffortCosmicPointsLabel"
          min="0"
          oninput="this.value = Math.abs(this.value)"
          onkeydown="return event.keyCode!==69"
          type="number"
          v-model="cosmicP"
        ></v-text-field>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs11>
          <v-select :items="cosmicTypeItems" :label="strings.addChangeEffortCosmicType"
                    v-model="cosmicT"></v-select>
        </v-flex>
        <v-flex class="infoIcon" xs1>
          <CInfoIcon :text="strings.addChangeCosmicTypeDescription"></CInfoIcon>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop, Watch} from "vue-property-decorator";
  import IEmittedCosmic from "../../model/IEmittedCosmic";
  import {StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";
  import CInfoIcon from "./CInfoIcon.vue";

  @Component({
    components: {
      CInfoIcon
    }
  })
  export default class CCosmicFunctionalDesign extends Vue {
    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @Prop() public cosmicPoints: number;
    @Prop() public cosmicType: string;

    public cosmicP: number = this.cosmicPoints;
    public cosmicT: string = this.cosmicType;

    public cosmicTypeItems: string[] = [];

    /**
     * this method sets the four attributes for the cosmic types which are entry, exit, read and write
     */
    public mounted() {
      this.cosmicTypeItems = [
        this.strings.addChangeCosmicEntry,
        this.strings.addChangeCosmicExit,
        this.strings.addChangeCosmicRead,
        this.strings.addChangeCosmicWrite
      ];
    }

    /**
     * emit data to parent if something change
     * @private
     */
    @Watch("cosmicP")
    public __cosmicPoints() {
      this.$emit("cosmic-effort", {
        cosmicPoints: this.cosmicP,
        cosmicType: this.cosmicT
      } as IEmittedCosmic);
    }

    /**
     * emit data to parent if something change
     * @private
     */
    @Watch("cosmicT")
    public __cosmicType() {
      this.$emit("cosmic-effort", {
        cosmicPoints: this.cosmicP,
        cosmicType: this.cosmicT
      } as IEmittedCosmic);
    }
  }
</script>

<style scoped>
  .infoIcon {
    margin-top: 20px;
  }
</style>
