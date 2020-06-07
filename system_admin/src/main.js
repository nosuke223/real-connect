import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import VueCookie from "vue-cookie";

Vue.config.productionTip = false;
Vue.use(VueCookie);

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
