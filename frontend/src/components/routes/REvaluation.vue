<template>
  <v-layout id="root">
    <!-- this component is the view for the evaluation view. It wraps graphs, information about the total system
    and information about scenarios for evaluation purposes -->
    <v-flex>
      <v-card :dark="darkeningGeneral">
        <v-card-text :dark="darkeningGeneral">
          <v-container grid-list-md>
            <v-layout row v-if="loadData" wrap>
              <v-label :dark="darkeningGeneral">{{strings.loading}}</v-label>
              <br>
              <v-progress-linear :indeterminate="true"></v-progress-linear>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs6>
                <v-layout class="widthTable" row wrap>
                  <v-select
                    :items="systemNames"
                    :label="strings.addSystemSystemName"
                    :placeholder="strings.addSystemSystemNamePlaceholder"
                    ref="chooseEvaluation"
                    v-model="evaluationSystemOne.systemName"
                  ></v-select>
                </v-layout>
              </v-flex>
              <!-- //TODO if someone ever decide to add a comparison of systems then the HTML part is already done
            <v-flex xs6>
              <v-layout row wrap class="widthTable">
                <v-select
                  :items="systemNames"
                  :label="strings.addSystemSystemName"
                  :placeholder="strings.addSystemSystemNamePlaceholder"
                  v-model="evaluationSystemTwo.systemName"
                ></v-select>
              </v-layout>
            </v-flex>-->
            </v-layout>
            <v-layout row v-if="!comparisionMode" wrap>
              <v-flex>
                <v-layout class="widthTable" row
                          v-show="evaluationSystemOne.systemName !== '' && evaluationSystemOne.systemName !== strings.evaluationNoSystem"
                          wrap>
                  <CEvaluation :evaluationSystem="evaluationSystemOne"
                               :systemNames="systemNames"></CEvaluation>
                </v-layout>
              </v-flex>
              <v-flex>
                <v-layout class="widthTable" row
                          v-show="evaluationSystemTwo.systemName !== '' && evaluationSystemTwo.systemName !== strings.evaluationNoSystem"
                          wrap>
                  <CEvaluation :evaluationSystem="evaluationSystemTwo"
                               :systemNames="systemNames"></CEvaluation>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-layout row v-else wrap>
              <v-flex xs6>
                <v-layout class="widthTable" row
                          v-show="evaluationSystemOne.systemName !== '' && evaluationSystemOne.systemName !== strings.evaluationNoSystem"
                          wrap>
                  <CEvaluation :evaluationSystem="evaluationSystemOne"
                               :systemNames="systemNames"></CEvaluation>
                </v-layout>
              </v-flex>
              <v-flex xs6>
                <v-layout class="widthTable" row
                          v-show="evaluationSystemTwo.systemName !== '' && evaluationSystemTwo.systemName !== strings.evaluationNoSystem"
                          wrap>
                  <CEvaluation :evaluationSystem="evaluationSystemTwo"
                               :systemNames="systemNames"></CEvaluation>
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
  import {Watch} from "vue-property-decorator";
  import {EvaluationRestClient} from "../../model/EvaluationRestClient";
  import IChange from "../../model/IChange";
  import IEvaluationSystem from "../../model/IEvaluationSystem";
  import IScenario from "../../model/IScenario";
  import IService from "../../model/IService";
  import ISystem from "../../model/ISystem";
  import {SystemRestClient} from "../../model/SystemRestClient";
  import {StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";
  import CEvaluation from "../general/CEvaluation.vue";

  @Component({
    components: {
      CEvaluation
    }
  })
  export default class REvaluation extends Vue {
    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @VueStateField(StateModule.GENERAL)
    public design: number;

    @VueStateField(StateModule.GENERAL)
    public loadData: boolean;

    @VueStateField(StateModule.SYSTEM)
    public systemName: string;

    public systems: ISystem[] = [];
    public changes: IChange[] = [];

    public systemNames: Array<String> = [];

    public evaluationSystemOne: IEvaluationSystem = {
      systemName: "",
      criticalService: {name: ""} as IService,
      scenarios: Array<IScenario>()
    } as IEvaluationSystem;
    public evaluationSystemTwo: IEvaluationSystem = {
      systemName: "",
      criticalService: {name: ""} as IService,
      scenarios: Array<IScenario>()
    } as IEvaluationSystem;

    public comparisionMode: boolean = false;

    $refs!: {
      chooseEvaluation: any;
    };

    /**
     * this method is called after the component was build. It calls the initializer and sets the focus on the first input field
     */
    public async mounted() {
      await this.init();
      this.$nextTick(() => this.$refs.chooseEvaluation.focus());
    }

    /**
     * this method initialise the necessary data
     */
    public async init() {
      this.loadData = true;
      this.systems = await SystemRestClient.getSystems();
      for (let i = 0; i < this.systems.length; i++) {
        this.systemNames.push(this.systems[i].name);
      }
      this.systemNames.push(this.strings.evaluationNoSystem);
      if (this.systemName !== undefined && this.systemName !== "") {
        this.setEvaluationSystem();
      }
      // noinspection TypeScriptUnresolvedVariable
      if (this.$route.params.id !== undefined) {
        // noinspection TypeScriptUnresolvedVariable
        let index = this.systems.findIndex(
          system => system._id === this.$route.params.id
        );
        this.systemName = this.systems[index].name;
      }
      this.loadData = false;
    }

    /**
     * this method initialise the data for the selected system
     * @private
     */
    @Watch("evaluationSystemOne.systemName")
    public async __systemOne() {
      //check if the selected system is no system or not selected to avoid the console fault no scenarios
      if (
        this.evaluationSystemOne.systemName !== "" &&
        this.evaluationSystemOne.systemName !== this.strings.evaluationNoSystem
      ) {
        this.systemName = this.evaluationSystemOne.systemName;
        //get the data
        let resultRequest = await EvaluationRestClient.getEvaluationSystem(
          this.systems[this.systems.findIndex((system) => system.name === this.evaluationSystemOne.systemName)]._id
        ).catch(e => {
          console.log(e);
        });
        // noinspection TypeScriptUnresolvedVariable
        this.evaluationSystemOne = resultRequest.data.evaluationSystem;
      }
      //check it there is another system selected
      this.comparisionMode =
        this.evaluationSystemOne.systemName !== this.strings.evaluationNoSystem &&
        this.evaluationSystemOne.systemName !== "" &&
        (this.evaluationSystemTwo.systemName !==
          this.strings.evaluationNoSystem &&
          this.evaluationSystemTwo.systemName !== "");
    }

    /**
     * this method initialise the data for the selected system
     * @private
     */
    @Watch("evaluationSystemTwo.systemName")
    public async __systemTwo() {
      //check if the selected system is no system or not selected to avoid the console fault no scenarios
      if (
        this.evaluationSystemTwo.systemName !== "" &&
        this.evaluationSystemTwo.systemName !== this.strings.evaluationNoSystem
      ) {
        //get the data
        let resultRequest = await EvaluationRestClient.getEvaluationSystem(
          this.evaluationSystemTwo.systemName
        );
        this.evaluationSystemTwo = resultRequest.data.evaluationSystem;
      }
      //check it there is another system selected
      this.comparisionMode =
        this.evaluationSystemOne.systemName !== this.strings.evaluationNoSystem &&
        this.evaluationSystemOne.systemName !== "" &&
        (this.evaluationSystemTwo.systemName !==
          this.strings.evaluationNoSystem &&
          this.evaluationSystemTwo.systemName !== "");
    }

    /**
     * this method sets the route and sets the system selection
     */
    @Watch("systemName")
    public __setEvaluationSystem() {
      if (this.systemName !== undefined) {
        this.setEvaluationSystem();
      }
    }

    /**
     * this method sets the route and sets the system selection
     */
    public setEvaluationSystem() {
      this.evaluationSystemOne.systemName = this.systemName;
      let index = this.systems.findIndex(
        system => system.name === this.systemName
      );
      this.$router.replace("/evaluation/" + this.systems[index]._id);
    }
  }
</script>

<style scoped>
  #root {
    min-height: 100vh;
    height: 100%;
  }

  .widthTable {
    width: 97%;
  }

  .twoTables {
    width: 50%;
  }

  .oneTable {
    width: 100%;
  }
</style>
