<template>
  <v-content class="ccontent">
    <!-- this component wraps the content-->
    <v-container align-center="align-center" fill-height="true" fluid="true" justify-center="justify-center">
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
    </v-container>
  </v-content>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";

  @Component
  export default class CContent extends Vue {
  }
</script>

<style>
  .ccontent {
    min-height: 100%;
    height: 100%;
    background: url("../../assets/background.jpg");
  }

  .wrapper {
    max-width: 2000px;
  }
</style>
