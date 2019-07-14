<template>
  <v-toolbar :clipped-left="$vuetify.breakpoint.mdAndUp" :dark="darkeningGeneral" app fixed id="c-toolbar">
    <!-- this component creates the toolbar -->
    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    <v-toolbar-title justify-center>{{strings.toolbarName}}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu :dark="darkeningGeneral" bottom="bottom" left="left" offset-y="offset-y" open-on-hover="open-on-hover">
      <v-btn icon large slot="activator">
        <v-avatar size="32px" tile>
          <v-icon>build</v-icon>
        </v-avatar>
      </v-btn>
      <v-list :three-line="true">
        <v-list-tile>
          <v-radio-group column="column" v-model="design">
            <v-radio :label="strings.toolbarDesign1" :value="1"></v-radio>
            <v-radio :label="strings.toolbarDesign2" :value="2"></v-radio>
          </v-radio-group>
        </v-list-tile>
      </v-list>
      <v-list :three-line="true">
        <v-list-tile>
          <v-radio-group column="column" v-model="design">
            <v-radio :label="strings.toolbarDesign4" :value="4"></v-radio>
            <v-radio :label="strings.toolbarDesign5" :value="5"></v-radio>
          </v-radio-group>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-menu :dark="darkeningGeneral" bottom="bottom" left="left" offset-y="offset-y" open-on-hover="open-on-hover">
      <v-btn icon large slot="activator">
        <v-avatar size="32px" tile>
          <v-icon>settings</v-icon>
        </v-avatar>
      </v-btn>
      <v-list :three-line="true">
        <v-list-tile @click="changeTheme()">
          <v-switch :label="strings.toolbarDarkThemeSelector" v-model="themeSwitch"></v-switch>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script lang="ts">
  import Vue from "vue";
  import {Component, Watch} from "vue-property-decorator";
  import {StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";

  @Component
  export default class CToolBar extends Vue {
    @VueStateField(StateModule.APP)
    public drawer: object;

    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @VueStateField(StateModule.GENERAL)
    public strings: any;

    public theme: string = "Light";
    public themeSwitch: boolean = false;

    @VueStateField(StateModule.GENERAL)
    public design: number;

    /**
     * this method sets the theme out of the local storage
     */
    public mounted() {
      let theme = localStorage.getItem("theme");
      if (theme !== null) {
        if (theme === "Light") {
          this.theme = theme;
          this.themeSwitch = false;
        }
        if (theme === "Dark") {
          this.theme = theme;
          this.themeSwitch = true;
        }
      } else {
        this.theme = "Light";
        this.themeSwitch = false;
      }
    }

    /**
     * once the switch for change the theme is triggered adjust the bool and the local storage for the theme
     * @private
     */
    @Watch("theme")
    public __changeTheme() {
      this.darkeningGeneral = this.theme === this.strings.themeDark;
      if (this.darkeningGeneral === false) {
        localStorage.setItem("theme", this.strings.themeLight);
      } else {
        localStorage.setItem("theme", this.strings.themeDark);
      }
    }

    /**
     * when the effort estimation method changes, set the method in the local storage
     * @private
     */
    @Watch("design")
    public __changeDesign() {
      if (this.design === 1) {
        localStorage.setItem("design", "1");
      }
      if (this.design === 2) {
        localStorage.setItem("design", "2");
      }
      if (this.design === 4) {
        localStorage.setItem("design", "4");
      }
      if (this.design === 5) {
        localStorage.setItem("design", "5");
      }
    }

    /**
     * change the theme
     */
    public changeTheme() {
      if (this.theme === this.strings.themeLight) {
        this.theme = this.strings.themeDark;
        this.themeSwitch = true;
      } else {
        this.theme = this.strings.themeLight;
        this.themeSwitch = false;
      }
    }
  }
</script>

<style>
</style>

