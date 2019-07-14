<template>
  <!-- This component is dialog where you can confirm that you want to delete a system or scenario -->
  <v-layout id="root">
    <v-dialog :dark="darkeningGeneral" max-width="500" v-model="dialogD">
      <v-card :dark="darkeningGeneral">
        <v-card-title class="headline" primary-title>{{strings.deletionDialogTitle}}</v-card-title>

        <v-card-text>{{strings.deletionDialogConfirmation}}{{component}}?</v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn @click="dialogD = false" flat>{{strings.deletionDialogButtonCancel}}</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="deleteComponent()" color="primary" flat>{{strings.deletionDialogButtonConfirm}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop, Watch} from "vue-property-decorator";
  import {StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";

  @Component({
    components: {}
  })
  export default class CDeleteDialog extends Vue {
    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @Prop() public dialog: boolean;
    @Prop() public component: string;
    @Prop() public id: string;

    public dialogD: boolean = this.dialog;

    /**
     * this method sends a deleting message to the parent component so it can delete the object like a scenario
     */
    public deleteComponent() {
      this.$emit("delete-System", this.id);
      this.dialogD = false;
    }

    /**
     * to avoid warnings in the console, a component intern dialog variable needs to be set like the property
     * @private
     */
    @Watch("dialog")
    public __dialog() {
      this.dialogD = this.dialog;
    }

    /**
     * once the dialogD is false, the dialog in the parent should also be false, so message has to be sent to tbe parent
     * @private
     */
    @Watch("dialogD")
    public __dialogD() {
      if (!this.dialogD) {
        this.$emit("closed-Dialog", this.dialogD);
      }
    }
  }
</script>

<style scoped>
</style>
