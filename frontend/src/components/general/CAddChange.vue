<template>
  <v-layout :dark="darkeningGeneral" row style="margin-top: 10px; margin-left: 10px;" wrap>
    <!-- this component is the UI for adding a change. It is applied in the second step of RAddScenario
    and REditScenario-->
    <v-flex>
      <v-form lazy-validation ref="form" v-model="validate">
        <v-layout row wrap>
          <v-flex xs11>
            <v-select :items="changeTypes" :label="strings.addChangesChangeType" :rules="changeTypeRule"
                      ref="chooseChange" v-model="changeData.type"></v-select>
          </v-flex>
          <v-flex class="infoIcon" xs1>
            <CInfoIcon :text="strings.addChangeTypeDescription"></CInfoIcon>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs11>
            <v-select
              :items="serviceNamesAdvanced"
              :label="strings.addChangesNameOfAffectedService"
              :rules="affectedServiceRule"
              v-if="changeData.type !== changeTypes[1]"
              v-model="affectedS"
            ></v-select>
            <v-text-field :label="strings.addServiceServiceName"
                          :placeholder="strings.addServiceServiceNamePlaceholder"
                          :rules="affectedServiceRule"
                          v-else v-model="affectedS"></v-text-field>
          </v-flex>
          <v-flex class="infoIcon" xs1>
            <CInfoIcon :text="strings.addChangeAffectedServiceDescription"></CInfoIcon>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-textarea
            :label="strings.addChangesChangeDescription"
            :placeholder="strings.addServiceServiceDescriptionPlaceholder"
            :rules="descriptionRules"
            v-model="changeData.description"
          ></v-textarea>
        </v-layout>

        <v-divider v-show="potentialRipples.length > 0"></v-divider>
        <v-layout row v-show="potentialRipples.length > 0" wrap>
          <v-label style="font-size: 12pt">{{strings.addChangePotentialRipples}}</v-label>
          <div :key="index" class="text-xs-center" v-for="(pRipple, index) in potentialRipples">
            <v-chip style="color: dodgerblue" v-if="ripplesN.includes(potentialRipples[index])">
              {{pRipple}}
            </v-chip>
            <v-chip @click="ripplesN.push(potentialRipples[index])" v-else>{{pRipple}}</v-chip>
          </div>
        </v-layout>
        <v-divider v-show="potentialRipples.length > 0"></v-divider>

        <v-layout row style="margin-top: 5px" wrap>
          <v-flex xs11>
            <v-select :items="serviceN" :label="strings.addChangeRippleLabel"
                      @blur="closeDependencies()" @focus="openDependencies()" chips clearable multiple
                      ref="selectRipples" solo
                      v-bind:class="{ dependenciesOpen: dependenciesSizeOpen}" v-model="ripplesN">
              <template slot="selection" slot-scope="data">
                <v-chip :selected="data.selected" @input="remove(data.item)" close>
                  <strong>{{ data.item }}</strong>
                </v-chip>
              </template>
            </v-select>
          </v-flex>
          <v-flex class="infoIcon" xs1>
            <CInfoIcon :text="strings.addChangeRippleDescription"></CInfoIcon>
          </v-flex>
        </v-layout>
        <v-layout row v-if="design === 1" wrap>
          <CHoursDesign :hours="changeData.effortHours" :label="strings.addChangeEffortH"
                        v-model="changeData.effortHours"></CHoursDesign>
        </v-layout>
        <v-layout row v-if="design === 2" wrap>
          <COrdinalDesign :label="strings.addChangeEffortOrdinal" :ordinal="changeData.effortOrdinal"
                          v-model="changeData.effortOrdinal"></COrdinalDesign>
        </v-layout>
        <v-layout row v-if="design === 4" wrap>
          <CCosmicFunctionalDesign :cosmicPoints="changeData.effortCosmicFunctionPoints"
                                   :cosmicType="changeData.cosmicType"
                                   v-on:cosmic-effort="getCosmic"></CCosmicFunctionalDesign>
        </v-layout>
        <v-layout :dark="darkeningGeneral" row v-if="design === 5" wrap>
          <CStoryPointsDesign :label="strings.addChangeEffortStoryPoints"
                              :storyPoints="changeData.effortStoryPoints"
                              v-model="changeData.effortStoryPoints"></CStoryPointsDesign>
        </v-layout>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop, Watch} from "vue-property-decorator";
  import IChange from "../../model/IChange";
  import IEmittedChange from "../../model/IEmittedChange";
  import IEmittedCosmic from "../../model/IEmittedCosmic";
  import IService from "../../model/IService";
  import ISystem from "../../model/ISystem";
  import {StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";
  import CCosmicFunctionalDesign from "./CCosmicFunctionalDesign.vue";
  import CHoursDesign from "./CHoursDesign.vue";
  import CInfoIcon from "./CInfoIcon.vue";
  import COrdinalDesign from "./COrdinalDesign.vue";
  import CStoryPointsDesign from "./CStoryPointsDesign.vue";

  @Component({
    components: {
      CInfoIcon,
      CHoursDesign,
      COrdinalDesign,
      CCosmicFunctionalDesign,
      CStoryPointsDesign
    }
  })
  export default class CAddChange extends Vue {
    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @VueStateField(StateModule.GENERAL)
    public design: number;

    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @Prop() public changeTypes: Array<string>;
    @Prop() public serviceNames: Array<string>;
    @Prop() public affectedService: IService;
    @Prop() public change: IChange;
    @Prop() public system: ISystem;

    public affectedS: string = this.affectedService.name;
    public ripplesN: Array<string> = [];
    public serviceN: Array<string> = this.serviceNames;
    public serviceNamesAdvanced: Array<string> = this.serviceNames;
    public validate: boolean = true;
    public changeData: IChange = {
      type: this.change.type,
      description: this.change.description,
      effortHours: this.change.effortHours,
      effortCodeNew: this.change.effortCodeNew,
      effortOrdinal: this.change.effortOrdinal,
      effortCosmicFunctionPoints: this.change.effortCosmicFunctionPoints,
      ripples: this.change.ripples,
      effortStoryPoints: this.change.effortStoryPoints,
      cosmicType: this.change.cosmicType
    } as IChange;
    public potentialRipples: Array<string> = [];

    public dependenciesSizeOpen: boolean = false;

    $refs!: {
      chooseChange: any;
      form: any;
      selectRipples: any;
    };

    public changeTypeRule: any[] = [v => !!v || "Type is required"];

    public descriptionRules: any[] = [
      v => !!v || "Description is required",
      v =>
        (v && v.length <= 150) ||
        "The description must be less than 150 characters"
    ];

    public affectedServiceRule: any[] = [v => !!v || "Affected Service is required"];

    /**
     * this method convert the ripples to only ripple names and sets the focus on the change type
     */
    public mounted() {
      for (let i = 0; i < this.change.ripples.length; i++) {
        this.ripplesN.push(this.change.ripples[i].name);
      }
      if (this.affectedS.includes("[new addition]")) {
        this.affectedS = this.affectedS.split("] ")[1];
      }
      this.$nextTick(() => this.$refs.chooseChange.focus());
    }

    /**
     * this method remove a service from the ripples
     * @param item
     */
    public remove(item) {
      this.ripplesN.splice(this.ripplesN.indexOf(item), 1);
      this.ripplesN = [...this.ripplesN];
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
     * send data to the parent
     */
    public getData() {
      this.$emit("whole-change", {
        change: this.changeData,
        rippleNames: this.ripplesN,
        affectedService: this.affectedS
      } as IEmittedChange);
    }

    /**
     * get the data from the child
     * @param data
     */
    public getCosmic(data: IEmittedCosmic) {
      this.changeData.cosmicType = data.cosmicType;
      this.changeData.effortCosmicFunctionPoints = data.cosmicPoints;
    }

    @Watch("changeData.type")
    public __checkTypeChange() {
      this.affectedS = "";
    }

    @Watch("serviceNames", {immediate: true, deep: true})
    public __watchServiceNames() {
      this.serviceNamesAdvanced = this.serviceNames.slice(0);
      for (let i = 0; i < this.serviceNamesAdvanced.length; i++) {
        if (this.serviceNamesAdvanced[i].includes("[new addition]")) {
          this.serviceNamesAdvanced.splice(i, 1);
          i = -1;
        }
      }
    }

    /**
     * once the affected service has changed, the potential ripples are updated for the selected service
     * @private
     */
    @Watch("affectedS", {immediate: true, deep: true})
    public __watchAffectedService() {
      this.potentialRipples = [];
      for (let i = 0; i < this.system.services.length; i++) {
        for (let j = 0; j < this.system.services[i].associations.length; j++) {
          if (this.affectedS.toLocaleLowerCase() === this.system.services[i].associations[j].toLocaleLowerCase() &&
            this.affectedS.toLocaleLowerCase() !== this.system.services[i].name.toLocaleLowerCase()) {
            this.potentialRipples.push(this.system.services[i].name);
          }
        }
      }
    }

    /**
     * once the affected service has changed, the potential ripples are updated for the selected service
     * @private
     */
    @Watch("affectedService", {immediate: true, deep: true})
    public __watchAffectedServiceProp() {
      if (this.$refs.selectRipples !== undefined) {
        this.potentialRipples = [];
        for (let i = 0; i < this.system.services.length; i++) {
          for (let j = 0; j < this.system.services[i].associations.length; j++) {
            if (this.affectedService.name.toLocaleLowerCase() === this.system.services[i].associations[j].toLocaleLowerCase() &&
              this.affectedService.name.toLocaleLowerCase() !== this.system.services[i].name.toLocaleLowerCase()) {
              this.potentialRipples.push(this.system.services[i].name);
            }
          }
        }
      }
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
  }
</script>

<style scoped>
  .infoIcon {
    margin-top: 20px;
  }

  .dependenciesOpen {
    max-width: 480px
  }
</style>
