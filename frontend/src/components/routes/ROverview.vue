<template>
  <v-layout id="root">
    <!-- this component shows overall information about how the tool works and a small taxonomy of our method -->
    <v-flex>
      <v-card :dark="darkeningGeneral">
        <v-card-text :dark="darkeningGeneral">
          <v-container grid-list-md>
            <v-layout row style="margin-top: 25px" wrap>
              <v-flex xs6>
                <h2>{{strings.overviewHowTo}}</h2>
                <ol>
                  <li>{{strings.overviewFirstPoint}}</li>
                  <ol>
                    <li>{{strings.overviewFirstPointOne}}</li>
                    <li>{{strings.overviewFirstPointTwo}}</li>
                    <li>{{strings.overviewFirstPointThree}}</li>
                  </ol>
                  <li>{{strings.overviewSecondPoint}}</li>
                  <ol>
                    <li>{{strings.overviewSecondPointOne}}</li>
                    <li>{{strings.overviewSecondPointTwo}}</li>
                    <li>{{strings.overviewSecondPointThree}}</li>
                  </ol>
                  <li>{{strings.overviewThirdPoint}}</li>
                </ol>
              </v-flex>

              <v-flex xs6>
                <v-layout align-center justify-center row wrap>
                  <v-flex md6 order-md1 order-sm1 sm12 xs12>
                    <v-layout align-center justify-center row wrap>
                      <v-icon @click="goToAddSystems()" align-center justify-center large>event
                      </v-icon>
                      <v-icon @click="goToAddSystems()" align-center justify-center small>add
                      </v-icon>
                    </v-layout>
                    <v-layout align-center justify-center row wrap>
                      <v-btn @click="goToAddSystems()" flat>{{strings.overviewSystems}}</v-btn>
                    </v-layout>
                  </v-flex>
                  <v-flex md6 order-md4 order-sm4 sm12 xs12>
                    <v-layout align-center justify-center row wrap>
                      <v-icon @click="goToExplanation()" align-center justify-center large>help
                      </v-icon>
                    </v-layout>
                    <v-layout align-center justify-center row wrap>
                      <v-btn @click="goToExplanation()" flat>{{strings.overviewEffortMethods}}
                      </v-btn>
                    </v-layout>
                  </v-flex>
                </v-layout>
                <v-layout align-center justify-center row wrap>
                  <h2>Taxonomy</h2>
                </v-layout>
                <v-layout row wrap>
                  <div
                    v-bind:class="{ imageWrapperDark: darkeningGeneral, imageWrapperLight: !darkeningGeneral }">
                    <div
                      v-bind:class="{ imageWrapperDark: darkeningGeneral, imageWrapperLight: !darkeningGeneral }"></div>
                  </div>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";

  @Component
  export default class ROverview extends Vue {
    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @VueStateField(StateModule.GENERAL)
    public strings: any;

    /**
     * this method routes the user to the RAddSystem component
     */
    public goToAddSystems() {
      this.$router.push("/add-system/");
      this.$router.replace("/add-system/");
    }

    /**
     * this method routes the user to the RExplanationEffortMethod component
     */
    public goToExplanation() {
      this.$router.push("/effort-estimation-methods");
      this.$router.replace("/effort-estimation-methods");
    }
  }
</script>

<style scoped>
  #root {
    min-height: 100vh;
    height: 100%;
  }

  .imageWrapperLight {
    background: url("../../assets/Tax.png");
    height: 278px;
    width: 484px;
    overflow: auto;
    margin: 0 auto;
    white-space: nowrap
  }

  .imageWrapperDark {
    background: url("../../assets/TaxDark.png");
    height: 281px;
    width: 487px;
    overflow: auto;
    margin: 0 auto;
    white-space: nowrap
  }
</style>
