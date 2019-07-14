<template>
  <v-layout row wrap>
    <!-- component visualise the story point design -->
    <v-flex>
      <v-layout row wrap>
        <v-label>{{label}}</v-label>
      </v-layout>
      <v-layout row style="width: 92%; margin-left: 3%" wrap>
        <v-slider :tick-labels="effortScale" always-dirty max="9" min="0" step="1" thumb-label thumb-size="64"
                  ticks="always" v-model="storyP">
          <template slot="thumb-label" slot-scope="props">
            <span>{{ changeIt(props.value) }}</span>
          </template>
        </v-slider>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop, Watch} from "vue-property-decorator";

  @Component({
    components: {}
  })
  export default class CStoryPointsDesign extends Vue {
    @Prop() public label: string;
    @Prop() public storyPoints: number;

    public effortScale: Array<number> = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100];
    public storyP: number = this.storyPoints;

    /**
     * this method sets the point of the story point scale
     */
    public mounted() {
      this.storyP = this.effortScale.findIndex(
        effort => effort === this.storyPoints
      );
    }

    /**
     * this method sets the point of the story point scale
     */
    public updated() {
      this.storyP = this.effortScale.findIndex(
        effort => effort === this.storyPoints
      );
    }

    /**
     * adjust the number in the scale
     * @param val
     */
    public changeIt(val) {
      return this.effortScale[val];
    }

    /**
     * emit data to the parent
     * @param val
     * @private
     */
    @Watch("storyP")
    public __storyP(val) {
      if (val) {
        this.$emit("input", this.effortScale[val]);
      }
    }
  }
</script>

<style scoped>
</style>
