<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-layout row wrap>
    <!-- this component creates the expansion panel for the services -->
    <v-expansion-panel expand v-model="panel">
      <v-expansion-panel-content :key="index" v-for="(service ,index) in appStore.state.services">
        <template v-slot:header>
          <div ref="header">{{service.name}}</div>
        </template>
        <v-card>
          <v-card-text
            v-bind:class="{ darkThemeBackgroundExpand: darkeningGeneral, lightThemeBackgroundExpand: !darkeningGeneral }"
            v-show="!editing">
            <v-layout row wrap>
              <v-flex pa-1 shrink>{{strings.addServiceServiceDescription}}</v-flex>
              <v-flex grow pa-1>{{service.description}}</v-flex>
            </v-layout>
          </v-card-text>
          <v-card-text
            v-bind:class="{ darkThemeBackgroundExpand: darkeningGeneral, lightThemeBackgroundExpand: !darkeningGeneral }"
            v-if="!editing">
            <v-layout row v-show="service.associations.length > 0" wrap>
              <v-flex pa-1 shrink>{{strings.addServiceAssociates}}</v-flex>
              <v-flex grow pa-1>
                <span :key="index" row v-for="(association, index) in service.associations" wrap>
                  {{association}}
                  <br>
                </span>
              </v-flex>
            </v-layout>
            <v-layout align-end justify-end row wrap>
              <v-icon @click="editing = true" class="mr-2" small>edit</v-icon>
              <v-icon @click="deleteService(index)" small>delete</v-icon>
            </v-layout>
          </v-card-text>
          <v-card-text
            v-bind:class="{ darkThemeBackgroundExpand: darkeningGeneral, lightThemeBackgroundExpand: !darkeningGeneral }"
            v-else>
            <v-flex>
              <v-layout row wrap>
                <CAddService :editing="true" :service="service" :services="appStore.state.services"
                             ref="services"
                             v-on:whole-service="$emit('whole-service', $event)"></CAddService>
              </v-layout>
              <v-layout row wrap>
                <v-btn @click="abortEditing(index)">{{strings.addServiceAbort}}</v-btn>
                <v-btn @click="saveEditedService(index)" color="primary">
                  {{strings.addServiceSaveButton}}
                </v-btn>
              </v-layout>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Watch} from "vue-property-decorator";
  import {AppStore, StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";
  import CAddService from "./CAddService.vue";

  @Component({
    components: {
      CAddService
    }
  })
  export default class CExpansionPanelServices extends Vue {
    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @VueStateField(StateModule.SYSTEM)
    public rippleUpdate: any;

    public appStore: any = AppStore;

    public editing: boolean = false;

    public panel = [];
    public openPanelTab = -1;
    public oldOpen = -1;

    $refs!: {
      services: any;
      header: any;
    };

    /**
     * this method remove a service from the services in the vuex store
     */
    public deleteService(index) {
      AppStore.commit("removeService", index);
    }

    /**
     * this method saves the edited service
     */
    public saveEditedService(index) {
      this.$refs.services[index].getNameAndDescription();
      this.$refs.services[index].validation();
      if (
        AppStore.state.service.name !== "" &&
        AppStore.state.service.description.length < 150 &&
        AppStore.state.service.name.length < 50
      ) {
        AppStore.commit("setSingleService", {
          index: index,
          service: AppStore.state.service
        });
        this.editing = false;
        AppStore.commit("resetService");
        this.$refs.services[index].resetValidation();
        this.rippleUpdate = !this.rippleUpdate;
      }
    }

    /**
     * this method abort the editing process of a service
     * @param index
     */
    public abortEditing(index) {
      this.editing = false;
      AppStore.commit("resetService");
      this.$refs.services[index].resetValidation();
    }

    /**
     * Reset the panel
     */
    public closePanel() {
      this.panel = [];
    }

    /**
     * this method checks what panel tab is open and sets a color to visualize its openness
     * @private
     */
    @Watch("panel")
    public __adjustBackgroundColorHeader() {
      let name = "grey";
      if (this.darkeningGeneral) {
        name = "darkThemeBackgroundExpand";
      } else {
        name = "lightThemeBackgroundExpand";
      }
      if (this.oldOpen !== -1) {
        // noinspection TypeScriptValidateJSTypes
        const indices = this.panel.reduce(
          (out, bool, index) => bool ? out.concat(index) : out,
          []
        );
        if (indices.length >= 2) {
          this.panel[this.oldOpen] = false;
        }
        if (this.$refs.header[this.openPanelTab] !== undefined) {
          this.$refs.header[this.openPanelTab].classList.remove(name);
        }
      }
      for (let i = 0; i < this.panel.length; i++) {
        if (this.panel[i] === true) {
          let arr = this.$refs.header[i].className.split(" ");
          if (arr.indexOf(name) == -1) {
            this.$refs.header[i].className += " " + name;
          }
          this.openPanelTab = i;
          this.oldOpen = i;
        }
      }
    }

    /**
     * this method sets the background color for the editing dialog
     * @private
     */
    @Watch("editing")
    public __adjustBackgroundEditing() {
      let element = this.$refs.header[this.openPanelTab];
      let name = "grey";
      if (this.darkeningGeneral) {
        name = "darkThemeBackgroundExpand";
      } else {
        name = "lightThemeBackgroundExpand";
      }
      if (this.editing) {
        let arr = element.className.split(" ");
        if (arr.indexOf(name) == -1) {
          element.className += " " + name;
        }
      }
    }
  }
</script>

<style scoped>
  .lightThemeBackgroundExpand {
    background-color: #cccccc;
  }

  .darkThemeBackgroundExpand {
    background-color: #000000;
  }
</style>
