<template>
  <v-layout row wrap>
    <!-- component visualise the ordinal scale design -->
    <v-flex>
      <v-layout row wrap>
        <v-label>{{label}}</v-label>
      </v-layout>
      <v-layout row style="width: 92%; margin-left: 3%" wrap>
        <v-slider :tick-labels="effortScale" :value="[0, 1]" always-dirty max="10" min="0" thumb-label
                  thumb-size="64" ticks="always" v-model="ordinalData">
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
  export default class COrdinalDesign extends Vue {
    @Prop() public label: string;
    @Prop() public ordinal: number;

    public ordinalData: number = this.ordinal;
    public effortScale: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
    @Watch("ordinalData")
    public __ordinalData(val) {
      if (val) {
        this.$emit("input", val);
      }
    }
  }
</script>

<style scoped>
</style>
