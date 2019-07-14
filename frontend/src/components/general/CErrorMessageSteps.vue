<template>
  <!-- This component is a visualisation of the error message when creating systems and scenarios -->
  <v-layout>
    <v-flex>
      <v-layout align-end justify-end row v-show="errorOne" wrap>
        <label class="errorMessage">{{errorMessageOne}}</label>
      </v-layout>
      <v-layout align-end justify-end row v-show="errorTwo" wrap>
        <label class="errorMessage">{{errorMessageTwo}}</label>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop} from "vue-property-decorator";

  @Component({
    components: {}
  })
  export default class CErrorMessageSteps extends Vue {
    @Prop() public errorOne: boolean;
    @Prop() public errorTwo: boolean;
    @Prop() public errorMessageOne: string;
    @Prop() public errorMessageTwo: string;
  }
</script>

<style scoped>
  .errorMessage {
    color: red;
    margin-right: 1%;
  }
</style>
