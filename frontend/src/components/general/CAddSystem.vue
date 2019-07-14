<template>
  <v-layout row style="margin-top: 10px; margin-left: 10px;" wrap>
    <!-- this component is the UI for adding a system by its name, description. It does not create the
    full system with all its services. It is applied in the first step of RAddSystem and REditSystem-->
    <v-flex>
      <v-form lazy-validation ref="form" v-model="valid">
        <v-layout row wrap>
          <v-text-field :label="strings.addSystemSystemName"
                        :placeholder="strings.addSystemSystemNamePlaceholder"
                        :rules="nameRules" ref="systemN"
                        v-model="systemData.name"></v-text-field>
        </v-layout>
        <v-layout row wrap>
          <v-textarea
            :label="strings.addSystemSystemDescription"
            :placeholder="strings.addSystemSystemDescriptionPlaceholder"
            :rules="descriptionRules"
            v-model="systemData.description"
          ></v-textarea>
        </v-layout>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop} from "vue-property-decorator";
  import ISystem from "../../model/ISystem";
  import {StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";

  @Component({
    components: {}
  })
  export default class CAddSystem extends Vue {
    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @Prop() public system: ISystem;

    public systemData: ISystem = {
      name: this.system.name,
      description: this.system.description
    } as ISystem;

    public valid: boolean = true;

    $refs!: {
      systemN: any;
      form: any;
    };

    public nameRules: any[] = [
      v => !!v || "System name is required",
      v => (v && v.length <= 50) || "System name must be less than 50 characters"
    ];

    public descriptionRules: any[] = [
      v =>
        (v && v.length <= 150) ||
        "The description must be less than 150 characters"
    ];

    /**
     * method sets the focus on the first text field
     */
    public mounted() {
      this.$emit("whole-system", this.systemData);
      this.$nextTick(() => this.$refs.systemN.focus());
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
      this.$emit("whole-system", this.systemData);
    }
  }
</script>

<style scoped>
</style>
