window.$ = window.umbrella = require("umbrellajs");
// import hljs from 'highlight.js'
import Vue from "vue";
import App from "./App.vue";
import VueCookie from "vue-cookie";
import VueTouch from "vue-touch";
import VueLazyload from "vue-lazyload";
import _ from "lodash";
import router from "./router/system_admin-router.js";
import { request, setAuthorizationToken } from "./lib/request.js";
import filters from "./lib/filters";
import Vuetify from "vuetify";

Vue.use(VueCookie);
Vue.use(Vuetify);
Vue.use(VueLazyload, {
  throttleWait: 400,
  error: "/_assets/img/common/not-found.svg",
  loading: "/_assets/img/common/loading.gif",
  // trueで起動
  observer: true,
  // オプションを設定
  observerOptions: {
    rootMargin: "0px",
    threshold: 0.1,
  },
});

// ==============================
// Vue インスタンス
// ==============================
Vue.use(VueTouch, { name: "v-touch" });

const app = new Vue({
  el: "#app",
  router,
  // 使うコンポーネント
  components: {
    App,
  },
  data() {
    return {
      /**
       * モデルのデータ
       */
      userData: {},
      events: {},

      /**
       * フォームのデータ
       */
      loginFormData: {
        email: null,
        password: null,
      },

      /**
       * レンダリングに関するデータ
       */
      loading: false,
    };
  },
  created() {
    // if (this.$cookie.get('Authorization')) {
    //   setAuthorizationToken(this.$cookie.get('Authorization'));
    // } else {
    //   if (location.pathname !== '/admin/login/') {
    //     location.href = '/admin/login/'
    //   }
    // }
  },
  mounted() {
    // if (this.$cookie.get('Authorization')) {
    //   this.requestFetchUser();
    //   this.requestFetchEvents();
    // }
  },
  methods: {
    /**
     * 現在のユーザーのデータを設定
     */
    setCurrentUserData(userData) {
      this.userData = userData;

      if (this.userData) {
        // 管理する店舗がない → 一般ユーザー
        if (!this.userData.own_places) {
          // location.href = '/user/'
        }
      } else {
        // ログアウト処理
        this.$cookie.delete("Authorization");
        location.href = "/admin/login/";
      }
    },
    /**
     * ログインを実行する
     */
    requestLogin() {
      request("POST", "/sessions", {
        data: {
          email: this.loginFormData.email,
          password: this.loginFormData.password,
        },
      }).then((result) => {
        if (result.error) {
          alert("ログインに失敗しました");
        } else {
          this.$cookie.set("Authorization", result.authorization, {
            expires: "1M",
          });
          this.setCurrentUserData(result.data);
          location.href = "/admin/";
        }
      });
    },
    /**
     * ログアウトを実行する
     */
    requestLogout() {
      this.loading = true;
      const result = confirm("ログアウトしますか？");
      if (result) {
        request("DELETE", "/sessions").then(() => {
          this.loading = false;
          this.setCurrentUserData(null);
        });
      }
    },
    /**
     * ログインユーザーの情報を取得する
     */
    requestFetchUser() {
      request("GET", "/users").then((result) => {
        if (result.error) {
          this.handleRequestError(result.error);
          this.setCurrentUserData(null);
        } else {
          this.setCurrentUserData(result.data);
        }
      });
    },
    soundInit() {},
  },
  filters,
  vuetify: new Vuetify({
    icons: {
      iconfont: "mdi",
    },
  }),
});

// const fixedElem = document.querySelector('.ios-fixed-focus')
// const chatView = document.querySelector('.p-scrollable--talk');
// let scrollTop = window.scrollY
// let chatPT
// window.addEventListener('scroll', function(e) {
//   scrollTop = window.scrollY
//   fixedElem.style.top = scrollTop + 'px'
//   chatPT = scrollTop + 'px'
//   chatView.style.paddingTop = chatPT
// })

// ------------------------------
// localhost 判別でクラス付与
// ------------------------------
if (document.domain == "localhost") {
  $("body").addClass("is-localhost");
}

// require("./modules/_editor").editor();
// require("./modules/_objectFit").ofi();
// require("./modules/_ua").identification();
// require("./modules/_ua").checkDisplay();
// require("./modules/_pane").pane();
// require("./modules/_block").block();
// require("./modules/_menu").menu();
// require("./modules/_standalone").standalone();
// require("./modules/_selectImage").cover();
// require("./modules/_imagePreview").imagePreview();
// require("./modules/_toast").toast();
// require("./modules/_flick").flick();
// require("./modules/_pcMenu").collapse();
