import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import DatetimePicker from "vuetify-datetime-picker";
import router from "./router";
import VueCookie from "vue-cookie";
import "./assets/sass/style.scss";

Vue.config.productionTip = false;
Vue.use(VueCookie);
Vue.use(DatetimePicker);

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
