<template>
  <v-layout row wrap>
    <!-- this component create a node graph that represent the services and their associations -->
    <div class="scrollTrick">
      <d3-network :net-links="links" :net-nodes="nodes" :options="options"/>
    </div>
  </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {Prop, Watch} from "vue-property-decorator";
  import D3Network from "../../../node_modules/vue-d3-network";
  import {StateModule} from "../../store/AppStore";
  import {VueStateField} from "../../store/State";

  @Component({
    components: {
      D3Network
    }
  })
  export default class CGraphOfSystem extends Vue {
    @VueStateField(StateModule.GENERAL)
    public darkeningGeneral: boolean;

    @VueStateField(StateModule.SYSTEM)
    public rippleUpdate: any;

    @Prop() services: any[];

    public nodes: any[] = [];

    public links: any[] = [];

    public nodeSize: number = 20;
    public canvas: boolean = false;

    public options: any = {
      force: 3000,
      size: {w: 800, h: 500},
      nodeSize: this.nodeSize,
      nodeLabels: true,
      linkLabels: true,
      canvas: this.canvas,
      fontSize: 14,
      _color: "#4286f4"
    };

    /**
     * once the component is ready, create the graph
     */
    public mounted() {
      this.createGraph();
    }

    /**
     * this method creates the graph
     */
    public createGraph() {
      if (this.services !== undefined) {
        this.nodes = [];
        this.links = [];
        for (let i = 0; i < this.services.length; i++) {
          this.nodes.push({id: i, name: this.services[i].name, _color: "#4286f4", _labelClass: "nodes"});
        }
        for (let i = 0; i < this.services.length; i++) {
          for (let j = 0; j < this.services[i].associations.length; j++) {
            this.links.push({
              sid: i,
              tid: this.services.findIndex(service => service.name.toString() === this.services[i].associations[j]),
              _color: "#4286f4"
            });
          }
        }
      }
    }

    /**
     * once the services prop changes, recreate the graph
     * @private
     */
    @Watch("services", {immediate: true, deep: true})
    public __watchServices() {
      this.createGraph();
    }

    /**
     * to not miss the update in the ripples of a service, a boolean will change when the ripples change
     * @private
     */
    @Watch("rippleUpdate")
    public __updateGraph() {
      this.createGraph();
    }
  }
</script>

<style scoped>
  .nodes {
    font-size: 16px;
    color: #4286f4;
  }

  .scrollTrick {
    overflow: scroll;
    margin: 0 auto;
    white-space: nowrap;
    color: #4286f4;
  }

  body {
    color: #4286f4;
  }
</style>
