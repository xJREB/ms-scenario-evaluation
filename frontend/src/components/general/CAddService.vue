<template>
  <v-layout row style="margin-top: 10px; margin-left: 10px;" wrap>
    <!-- this component is the UI for adding a service. It is applied in the second step of RAddSystem
    and REditSystem -->
    <v-flex>
      <v-form lazy-validation ref="form" v-model="valid">
        <v-layout row wrap>
          <v-text-field :label="strings.addServiceServiceName"
                        :placeholder="strings.addServiceServiceNamePlaceholder"
                        :rules="nameRules" ref="serviceN"
                        v-model="serviceData.name"></v-text-field>
        </v-layout>
        <v-layout row wrap>
          <v-textarea
            :label="strings.addServiceServiceDescription"
            :placeholder="strings.addServiceServiceDescriptionPlaceholder"
            :rules="descriptionRules"
            v-model="serviceData.description"
          ></v-textarea>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs11>
            <v-select :items="serviceNames" :label="strings.addServiceAssociates"
                      @blur="closeDependencies()" @focus="openDependencies()" chips clearable multiple
                      solo v-bind:class="{ dependenciesOpen: dependenciesSizeOpen}"
                      v-model="serviceData.associations">
              <template slot="selection" slot-scope="data">
                <v-chip :selected="data.selected" @input="remove(data.item)" close>
                  <strong>{{ data.item }}</strong>
                </v-chip>
              </template>
            </v-select>
          </v-flex>
          <v-flex class="infoIcon" xs1>
            <CInfoIcon :text="strings.addServiceAssociatesAdvice"></CInfoIcon>
          </v-flex>
        </v-layout>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop, Watch} from "vue-property-decorator";
  import IService from "../../model/IService";
  import {StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";
  import CInfoIcon from "./CInfoIcon.vue";

  @Component({
    components: {
      CInfoIcon
    }
  })
  export default class CAddService extends Vue {
    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @VueStateField(StateModule.SYSTEM)
    public editingSystem: boolean;

    @Prop() public service: IService;
    @Prop() public services: IService[];
    @Prop() public editing: boolean;

    public serviceData: IService = {
      name: this.service.name,
      description: this.service.description,
      associations: []
    } as IService;
    public serviceNames: string[] = [];

    public valid: boolean = false;

    public dependenciesSizeOpen: boolean = false;

    $refs!: {
      serviceN: any;
      form: any;
    };

    public nameRules: any[] = [
      v => !!v || "Service name is required",
      v => (v && v.length <= 50) || "Service name must be less than 50 characters"
    ];

    public descriptionRules: any[] = [
      v =>
        (v && v.length <= 150) ||
        "The description must be less than 150 characters"
    ];

    /**
     * sets the focus on the first text field
     */
    public mounted() {
      this.$nextTick(() => this.$refs.serviceN.focus());
      if (this.editingSystem) {
        this.serviceData = {
          name: this.service.name,
          description: this.service.description,
          _id: this.service._id,
          associations: []
        } as IService;
      }
      this.serviceNames = [];
      for (let i = 0; i < this.services.length; i++) {
        this.serviceNames.push(this.services[i].name);
      }
      if (this.editing) {
        this.serviceNames.splice(this.serviceNames.indexOf(this.service.name), 1);
      }
      if (this.service.associations !== undefined) {
        if (this.service.associations.length !== 0) {
          this.serviceData.associations = this.service.associations.slice(0);
        }
      }
    }

    /**
     * this method remove a dependency of the dependencies
     */
    public remove(item) {
      this.serviceData.associations.splice(
        this.serviceData.associations.indexOf(item),
        1
      );
      this.serviceData.associations = [...this.serviceData.associations];
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
    public getNameAndDescription() {
      this.$emit("whole-service", this.serviceData);
    }

    /**
     * this method adjust the service names for adding dependencies.
     * @private
     */
    @Watch("services", {immediate: true, deep: true})
    public __watchServiceNames() {
      this.serviceNames = [];
      for (let i = 0; i < this.services.length; i++) {
        this.serviceNames.push(this.services[i].name);
      }
      if (this.editing) {
        this.serviceNames.splice(this.serviceNames.indexOf(this.service.name), 1);
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
