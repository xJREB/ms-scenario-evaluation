<template>
  <!-- This component is a table that view all systems in a table -->
  <v-layout id="root">
    <v-flex>
      <v-card :dark="darkeningGeneral">
        <v-card-text :dark="darkeningGeneral">
          <v-container grid-list-md>
            <v-card-title>
              <v-btn @click="toAddSystem()">
                <v-icon>add_circle</v-icon>
                {{strings.systemOverviewToAdding}}
              </v-btn>
              <v-spacer></v-spacer>
              <v-text-field :label="strings.systemOverviewSearch" append-icon="search"
                            hide-details single-line v-model="searchTable"></v-text-field>
            </v-card-title>
            <v-data-table :headers="headerTable" :items="systems" :loading="loadData" :search="searchTable">
              <v-progress-linear color="blue" indeterminate slot="progress"></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td class="text-xs-left tableData">
                                    <span
                                      @click="toDetails(props.item._id, props.item.name, props.item.description, props.item.services, props.item)">{{ props.item.name }}</span>
                </td>
                <td class="text-xs-left tableData">{{ props.item.description }}</td>
                <td class="text-xs-left tableData">
                  <v-layout row wrap>{{props.item.services.length}}</v-layout>
                </td>
                <td class="text-xs-left tableData">
                  <v-icon
                    @click="editSystem(props.item._id, props.item.name, props.item.description, props.item.services, props.item)"
                    class="mr-2"
                    small>
                    edit
                  </v-icon>
                  <v-icon @click="openDialog(props.item._id, props.item.name)" small>delete</v-icon>
                </td>
              </template>
              <v-alert
                :value="true"
                color="error"
                icon="warning"
                slot="no-results"
              >{{strings.systemOverviewSearchNoResultPre}} "{{ searchTable }}"
                {{strings.systemOverviewSearchNoResultPost}}
              </v-alert>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
      <CDeleteDialog :component="system.name" :dialog="deletionDialog" :id="system._id"
                     v-on:closed-Dialog="closeDialog" v-on:delete-System="deleteSystem"></CDeleteDialog>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import ISystem from "../../model/ISystem";
  import {SystemRestClient} from "../../model/SystemRestClient";
  import {AppStore, StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";
  import CDeleteDialog from "../general/CDeleteDialog.vue";

  @Component({
    components: {
      CDeleteDialog
    }
  })
  export default class RSystemOverview extends Vue {
    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @VueStateField(StateModule.GENERAL)
    public strings: any;

    @VueStateField(StateModule.GENERAL)
    public design: number;

    @VueStateField(StateModule.GENERAL)
    public loadData: boolean;

    @VueStateField(StateModule.GENERAL)
    public error: string;

    @VueStateField(StateModule.GENERAL)
    public timeout: number;

    @VueStateField(StateModule.SYSTEM)
    public editingSystem: boolean;

    public searchTable: string = "";

    public headerTable: any = [
      {text: "", align: "left", sortable: true, value: "name"},
      {text: "", align: "left", sortable: false, value: "description"},
      {text: "", align: "left", sortable: true, value: "services.length"},
      {text: "", align: "left", sortable: false, value: "actions"}
    ];

    public systems: ISystem[] = [];

    public deletionDialog: boolean = false;
    public system: ISystem = {name: "", _id: ""} as ISystem;

    /**
     * this method set a system and its services to the Vuex Store and navigate to the RAddSystem component, where you can
     * edit the system
     */
    public editSystem(id, name, description, services, system) {
      this.editingSystem = true;
      this.setEditAppStoreData(name, id, description, system);
      if (services !== undefined) {
        AppStore.commit("setServices", services);
      }
      this.$router.push("/systems/" + system._id + "/edit");
      this.$router.replace("/systems/" + system._id + "/edit");
    }

    /**
     * this method set the AppStore with the system for editing and for the details
     */
    public setEditAppStoreData(name, id, description, system) {
      AppStore.commit("setCompleteSystem", system);
      AppStore.commit("setSystemName", name);
      AppStore.commit("setSystemID", id);
      AppStore.commit("setSystemDescription", description);
    }

    /**
     * this method delete a system
     */
    public deleteSystem(id) {
      let self = this;
      SystemRestClient.deleteSystem(id).then(() => {
        self.error = self.strings.systemOverviewDeleteSystem;
        setTimeout(function () {
          self.error = "";
        }, self.timeout);
        this.init();
      });
    }

    /**
     * this method is called when the html part was build. It initialize the header of the table and get all systems
     * from the backend
     */
    public async mounted() {
      await this.init();
      this.headerTable = [
        {
          text: this.strings.systemOverviewName,
          align: "left",
          sortable: true,
          value: "name"
        },
        {
          text: this.strings.systemOverviewDetails,
          align: "left",
          sortable: false,
          value: "description"
        },
        {
          text: this.strings.systemOverviewServices,
          align: "left",
          sortable: true,
          value: "services.length"
        },
        {
          text: this.strings.systemOverviewActions,
          align: "left",
          sortable: false,
          value: "actions"
        }
      ];
    }

    /**
     * this method get all systems from the backend
     */
    public async init() {
      this.loadData = true;
      this.systems = await SystemRestClient.getSystems();
      //filter additional services that was added through scenarios
      for (let i = 0; i < this.systems.length; i++) {
        this.systems[i].services = this.systems[i].services.filter(
          service => !service.name.includes("[new addition]")
        );
      }
      this.loadData = false;
    }

    /**
     * this method navigate to the RAddSystem component
     */
    public toAddSystem() {
      this.$router.push("/add-system");
      this.$router.replace("/add-system");
    }

    /**
     * this method set the system and its services to the AppStore and navigate to the RSystemDetails component,
     * where you can see all details for the system
     */
    public toDetails(id, name, description, services, system) {
      this.setEditAppStoreData(name, id, description, system);
      if (services !== undefined) {
        AppStore.commit("setServices", services);
      }
      this.$router.push("/systems/" + system._id);
      this.$router.replace("/systems/" + system._id);
    }

    /**
     * this method opens the deletion dialog
     */
    public openDialog(id, name) {
      this.system._id = id;
      this.system.name = name;
      this.deletionDialog = true;
    }

    /**
     * this method set the variable that opens the dialog to false, so the dialog can be reopened
     * @param dialog
     */
    public closeDialog(dialog) {
      this.deletionDialog = dialog;
    }
  }
</script>

<style scoped>
  #root {
    min-height: 100vh;
    height: 100%;
  }

  .tableData {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  span {
    color: dodgerblue;
  }

  span:hover {
    text-decoration: underline;
    cursor: pointer;
  }
</style>
