<template>
  <v-layout row style="margin-top: 10px; margin-left: 10px;" wrap>
    <!-- this component is the UI for adding a scenario by its name, description and its tags. It does not create the
    full scenario with all its changes. It is applied in the first step of RAddScenario and REditScenario-->
    <v-flex>
      <v-form lazy-validation ref="form" v-model="validate">
        <v-layout row wrap>
          <v-select
            :disabled="editingScenario"
            :items="systemNames"
            :label="strings.addScenarioSystem"
            :placeholder="strings.addScenarioSystemPlaceholder"
            :rules="systemNameRule"
            ref="chooseSystem"
            v-model="scenarioS"
          ></v-select>
        </v-layout>
        <v-layout row wrap>
          <v-text-field
            :label="strings.addScenarioScenarioName"
            :placeholder="strings.addSystemSystemNamePlaceholder"
            :rules="scenarioNameRules"
            ref="scenarioN"
            v-model="scenarioData.name"
          ></v-text-field>
        </v-layout>
        <v-layout row wrap>
          <v-select :items="scenarioCategories" :label="strings.addScenarioScenarioCategory"
                    @blur="closeDependencies()" @focus="openDependencies()" chips clearable multiple
                    ref="selectTags" solo
                    v-bind:class="{ dependenciesOpen: dependenciesSizeOpen}" v-model="scenarioData.tags">
            <template slot="selection" slot-scope="data">
              <v-chip :selected="data.selected" @input="remove(data.item)" close>
                <strong>{{ data.item }}</strong>
              </v-chip>
            </template>
          </v-select>
        </v-layout>
        <v-layout row wrap>
          <v-textarea
            :label="strings.addScenarioScenarioDescription"
            :placeholder="strings.addSystemSystemDescriptionPlaceholder"
            :rules="descriptionRules"
            v-model="scenarioData.description"
          ></v-textarea>
        </v-layout>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop, Watch} from "vue-property-decorator";
  import IEmittedScenario from "../../model/IEmittedScenario";
  import IScenario from "../../model/IScenario";
  import {AppStore, StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";

  @Component({
    components: {}
  })
  export default class CAddScenario extends Vue {
    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @VueStateField(StateModule.SCENARIO)
    public editingScenario: boolean;

    @VueStateField(StateModule.SYSTEM)
    public systemName: string;

    @Prop() public systemNameProp: any;
    @Prop() public systemNames: Array<string>;
    @Prop() public scenario: IScenario;

    public scenarioS: string = this.systemNameProp;
    public scenarioData: IScenario = {
      name: this.scenario.name,
      description: this.scenario.description,
      category: this.scenario.category,
      tags: this.scenario.tags
    } as IScenario;
    public scenarioCategories: Array<any> = [];
    public validate: boolean = true;
    public dependenciesSizeOpen: boolean = false;

    public scenarioNameRules: any[] = [
      v => !!v || "Scenario name is required",
      v => (v && v.length <= 50) || "Scenario name must be less than 50 characters"
    ];

    public descriptionRules: any[] = [
      v =>
        (v && v.length <= 150) ||
        "The description must be less than 150 characters"
    ];

    public systemNameRule: any[] = [v => !!v || "System is required"];

    $refs!: {
      chooseSystem: any;
      form: any;
    };

    /**
     * this method set the scenario categories and the focus on the choosing system
     */
    public mounted() {
      this.scenarioCategories = [
        {header: "Technology"},
        this.strings.categorySafety,
        this.strings.categoryAlgorithm,
        this.strings.categoryHardware,
        this.strings.categoryCommunicationProtocol,
        this.strings.categoryNewProgrammingLanguage,
        {header: "Economy"},
        {divider: true},
        this.strings.categoryMarket,
        {header: "Database"},
        {divider: true},
        this.strings.categoryDBMS,
        this.strings.categoryUpgradeDatabase,
        {header: "Operating system"},
        {divider: true},
        this.strings.categoryOS,
        this.strings.categoryUpgradeOS,
        {header: "User interface"},
        {divider: true},
        this.strings.categoryUserInterface,
        {header: "Administration"},
        {divider: true},
        this.strings.categoryNewUserLevels,
        this.strings.categoryRemoteAdministration
      ];
      if (this.systemName !== undefined && this.systemName !== "" && !this.editingScenario) {
        this.scenarioS = this.systemName;
      }
      if (this.$refs.chooseSystem.focus() !== undefined) {
        this.$nextTick(() => this.$refs.chooseSystem.focus());
      }
    }

    /**
     * validates all fields by its rules
     */
    public validation() {
      this.$refs.form.validate();
    }

    /**
     * reset the validation
     */
    public resetValidation() {
      this.$refs.form.resetValidation();
    }

    /**
     * method emit the values of all components to the parent
     */
    public getData() {
      this.$emit("whole-scenario", {
        name: this.scenarioData.name,
        description: this.scenarioData.description,
        category: this.scenarioData.category,
        systemName: this.scenarioS,
        tags: this.scenarioData.tags
      } as IEmittedScenario);
    }

    /**
     * method reset the changes and add a custom category to the categories array
     * @private
     */
    @Watch("scenarioS")
    public __scenarioSystem() {
      AppStore.commit("resetChanges");
      this.$emit("scenarioAdding", {
        name: this.scenarioData.name,
        description: this.scenarioData.description,
        category: this.scenarioData.category,
        system: this.scenarioS
      });
    }

    /**
     * this method sets the bool for the dependencies menu which should shrink once it is open
     */
    public openDependencies() {
      this.dependenciesSizeOpen = true;
    }

    /**
     * this method sets the bool for the dependencies menu which should grow once it is closed
     */
    public closeDependencies() {
      this.dependenciesSizeOpen = false;
    }

    /**
     * this method removes tags from the selection
     * @param item
     */
    public remove(item) {
      this.scenarioData.tags.splice(this.scenarioData.tags.indexOf(item), 1);
      this.scenarioData.tags = [...this.scenarioData.tags];
    }
  }
</script>

<style scoped>
  .dependenciesOpen {
    max-width: 480px
  }
</style>
