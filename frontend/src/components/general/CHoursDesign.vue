<template>
  <v-layout row wrap>
    <!-- component visualise the hours design of adding changes -->
    <v-text-field :label="label" min="0" oninput="this.value = Math.abs(this.value)"
                  onkeydown="return event.keyCode!==69" type="number"
                  v-model="hoursData"></v-text-field>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop, Watch} from "vue-property-decorator";

  @Component({
    components: {}
  })
  export default class CHoursDesign extends Vue {
    @Prop() public label: string;
    @Prop() public hours: number;

    public hoursData: number = this.hours;

    /**
     * emit data to the parent
     * @param val
     * @private
     */
    @Watch("hoursData")
    public __hoursValue(val) {
      if (val) {
        this.$emit("input", val);
      }
    }
  }
</script>

<style scoped>
</style>
