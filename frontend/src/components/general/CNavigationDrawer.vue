<template>
  <v-navigation-drawer :clipped="$vuetify.breakpoint.mdAndUp" :dark="darkeningGeneral" app fixed
                       id="c-navigationdrawer"
                       v-model="drawer">
    <!-- this method creates the navigation drawer -->
    <v-list dense>
      <template v-for="item in items">
        <v-layout :key="item.heading" align-center row v-if="item.heading">
          <v-flex xs6>
            <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
          </v-flex>
          <v-flex class="text-xs-center" xs6>
            <a class="body-2 black--text" href="#!">{{strings.navigationDrawerEdit}}</a>
          </v-flex>
        </v-layout>
        <v-list-group :key="item.text" :prepend-icon="item.model ? item.icon : item['icon-alt']" append-icon
                      v-else-if="item.children" v-model="item.model">
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile :key="i" @click v-for="(child, i) in item.children">
            <v-list-tile-action v-if="child.icon">
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ child.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile :key="item.text" :to="item.route" v-else>
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
  import Vue from "vue";
  import {Component} from "vue-property-decorator";
  import {NAV_ITEMS_ENGLISH} from "../../router";
  import {StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";

  @Component
  export default class CNavigationDrawer extends Vue {
    @VueStateField(StateModule.APP)
    public drawer: boolean;

    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @VueStateField(StateModule.GENERAL)
    public strings: any;

    public items: any = NAV_ITEMS_ENGLISH;
  }
</script>
