<template>
  <v-layout row wrap>
    <!-- component creates an info icon with a tooltip -->
    <v-tooltip bottom>
      <span slot="activator">
        <v-icon class="infoPicture">info</v-icon>
      </span>
      <span>{{text}}</span>
    </v-tooltip>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop} from "vue-property-decorator";

  @Component({
    components: {}
  })
  export default class CInfoIcon extends Vue {
    @Prop() public text: string;
  }
</script>

<style scoped>
  .infoPicture {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  span {
    white-space: pre-wrap;
  }
</style>
