window.$ = window.umbrella = require('umbrellajs')
import hljs from 'highlight.js'
import Vue from 'vue'
import App from './App.vue'
import VueCookie from 'vue-cookie'
import VueTouch from 'vue-touch'
import VueLazyload from 'vue-lazyload'
import _ from 'lodash'
import router from './router/admin-router.js'
import { request, setAuthorizationToken } from './lib/request.js'
import filters from './lib/filters'

Vue.use(VueCookie);
Vue.use(VueLazyload, {
  throttleWait : 400,
  error: '/_assets/img/common/not-found.svg',
  loading: '/_assets/img/common/loading.gif',
  // trueで起動
  observer: true,
  // オプションを設定
  observerOptions: {
    rootMargin: '0px',
    threshold: 0.1,
  },
})

// ==============================
// Vue インスタンス
// ==============================
Vue.use(VueTouch, {name: 'v-touch'})

const app = new Vue({
  el: '#app',
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
    }
  },
  created() {
    if (this.$cookie.get('Authorization')) {
      setAuthorizationToken(this.$cookie.get('Authorization'));
    } else {
      if (location.pathname !== '/admin/login/') {
        location.href = '/admin/login/'
      }
    }
  },
  async mounted() {
    if (this.$cookie.get('Authorization')) {
      await this.requestFetchUser();
      if (this.userData) {
        await this.requestFetchEvents();
      }
    }
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
        } else {
          this.userData.selectedPlace = Object.assign({}, this.userData.own_places[this.userData.own_places.length - 1]);
        }
      } else {
        // ログアウト処理
        this.$cookie.delete('Authorization');
        location.href = '/admin/login/'
      }
    },
    /**
     * 開催中のイベントを取得
     */
    handleRequestError(error) {
      alert(error.messages);
    },
    /**
     * ログインを実行する
     */
    requestLogin() {
      request('POST', '/sessions', {
        data: { email: this.loginFormData.email, password: this.loginFormData.password }
      })
      .then((result) => {
        if (result.error) {
          alert('ログインに失敗しました');
        } else {
          this.$cookie.set('Authorization', result.authorization,　{ expires: '1M' });
          this.setCurrentUserData(result.data);
          location.href = '/admin/';
        }
      })
    },
    /**
     * ログアウトを実行する
     */
    requestLogout() {
      this.loading = true
      const result = confirm('ログアウトしますか？');
      if (result) {
        request('DELETE', '/sessions')
        .then(() => {
          this.loading = false
          this.setCurrentUserData({});
          location.href = '/admin/login';
        })
      }
    },
    /**
     * ログインユーザーの情報を取得する
     */
    async requestFetchUser() {
      try {
        const result = await request('GET', '/users');
        this.setCurrentUserData(result.data);
      } catch(error) {
        this.handleRequestError(error);
        this.setCurrentUserData(null);
      }
    },
    /**
     * 開催中のイベントを取得
     */
    async requestFetchEvents() {
      if (!this.userData.selectedPlace) return;
      try {
        const place_id = this.userData.selectedPlace.id;
        const result = await request('GET', `/owners/events?place_id=${place_id}`);
        this.events = result.data.events;
      } catch(error) {
        this.handleRequestError(error);
      }
    },
    /**
     * 場所の情報の更新
     */
    requestUpdateOwnPlace(data) {
      request('PUT', '/owners/places/' + this.userData.selectedPlace.id, { data })
      .then((result) => {
        if (result.error) {
          this.handleRequestError(result.error);
        } else {
          this.userData.selectedPlace = result.data;
        }
      })
    },
    /**
     * 場所・店舗の情報の取得
     */
    async requestFetchPlace() {
      try {
        const result = await request('GET', '/owners/places/' + this.userData.selectedPlace.id);
        this.userData.selectedPlace = result.data;
        // 現在のページがダッシュボード以外の場合はダッシュボードへ戻る
        const topPaths = [
          '/admin/',
          '/admin'
        ]
        if (!topPaths.includes(this.$route.path)) {
          this.$router.push('/admin/');
        } else {
          this.userData = Object.assign({}, this.userData);
        }
        await this.requestFetchEvents();
      } catch(error) {
        this.handleRequestError(error);
      }
    },
    soundInit() {},
  },
  filters,
})

hljs.initHighlightingOnLoad()

const fixedElem = document.querySelector('.ios-fixed-focus')
const chatView = document.querySelector('.p-scrollable--talk');
let scrollTop = window.scrollY
let chatPT
window.addEventListener('scroll', function(e) {
  scrollTop = window.scrollY
  fixedElem.style.top = scrollTop + 'px'
  chatPT = scrollTop + 'px'
  chatView.style.paddingTop = chatPT
})

// ------------------------------
// localhost 判別でクラス付与
// ------------------------------
// if (document.domain=='localhost') {
  $('body').addClass('is-localhost')
// }

require('./modules/_editor').editor();
require('./modules/_objectFit').ofi();
require('./modules/_ua').identification();
require('./modules/_ua').checkDisplay();
require('./modules/_pane').pane();
require('./modules/_block').block();
require('./modules/_menu').menu();
require('./modules/_standalone').standalone();
require('./modules/_selectImage').cover();
require('./modules/_imagePreview').imagePreview();
require('./modules/_toast').toast();
require('./modules/_flick').flick();
require('./modules/_pcMenu').collapse();
