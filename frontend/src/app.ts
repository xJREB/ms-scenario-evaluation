// Internal global dependencies
import "core-js/features/array";
import "core-js/features/string";

// Vue framework
import Vue from "vue";
// Google Charts
import VueGoogleCharts from "vue-google-charts";
// Vuetify UI components
import Vuetify from "vuetify";
// Kick start the main Vue component
import App from "./App.vue";
// VueRouter
import Router from "./router";
// Vuex store
import {AppStore} from "./store/AppStore";

Vue.use(Vuetify, {
  options: {
    themeVariations: ["content"]
  },
  theme: {}
});

Vue.use(VueGoogleCharts);

Vue.config.productionTip = false;

window.onload = () => {
  const app = new Vue({
    components: {
      App
    },
    el: ".app",
    render: (h) => h(App),
    router: Router,
    store: AppStore
  });
};
