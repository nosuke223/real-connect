window.$ = window.umbrella = require('umbrellajs')
const marked = require('marked')
import hljs from 'highlight.js'
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import App from './App.vue'
import talklist from './components/talklist.vue'
import noweventlist from './components/noweventlist.vue'
import pasteventlist from './components/pasteventlist.vue'
import placelist from './components/placelist.vue'
import talkroom from './components/talkroom.vue'
import ActionCable from 'actioncable'
import VueCookie from 'vue-cookie'
import VueTouch from 'vue-touch'
import VueLazyload from 'vue-lazyload'
import {TweenMax} from 'gsap'
import _ from 'lodash'

let BASE_URL = 'https://real-connect.herokuapp.com/api/v1';
let CABLE_URL = 'wss:real-connect.herokuapp.com/cable';

if (document.domain=='localhost') {
  BASE_URL = 'http://localhost:8080/api/v1';
  CABLE_URL = 'ws:localhost:8080/cable';
}

let cable = ActionCable.createConsumer(CABLE_URL);

Vue.prototype.$cable = cable;
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
// アコーディオン
// ==============================
let accordion = {
  data: function () {
    return {
      openedAccordions: []
    };
  },
  components: {
    accordion: {
      props: ['opened', 'duration', 'closedHeight'],
      computed: {
        innerHeight: function () {
          if (this.$refs.inner) {
            return this.$refs.inner.clientHeight;
          }
        },
        maxHeight: function () {
          return this.opened ? this.innerHeight : (this.closedHeight || 0);
        },
        transitionDuration: function () {
          return this.duration || 0.5;
        },
        wrapStyle: function () {
          return {
            maxHeight: this.maxHeight + 'px',
            transitionDuration: this.transitionDuration + 's',
            transitionProperty: 'max-height',
            overflow: 'hidden',
          };
        },
      },
      template: '\
          <div :style="wrapStyle">\
            <div ref="inner">\
              <slot></slot>\
            </div>\
          </div>',
    },
  },
  methods: {
    isOpenedAccordion: function (key) {
      return this.openedAccordions.indexOf(key) !== -1;
    },
    openAccordion: function (key) {
      if (this.isOpenedAccordion(key)) return;
      return this.openedAccordions.push(key);
    },
    closeAccordion: function (key) {
      var newOpened = [];
      for (var i = 0; i < this.openedAccordions.length; i++) {
        if (this.openedAccordions[i] === key) continue;
        newOpened.push(this.openedAccordions[i]);
      };
      this.openedAccordions = newOpened;
    },
    toggleAccordion: function (key, open) {
      open = open || !this.isOpenedAccordion(key);
      return open ? this.openAccordion(key) : this.closeAccordion(key);
    },
  },
};

// ==============================
// Vue インスタンス
// ==============================
Vue.use(VueTouch, {name: 'v-touch'})

const app = new Vue({
  el: '#app',
  mixins: [accordion],
  // 使うコンポーネント
  components: {
    App,
    talklist,
    noweventlist,
    pasteventlist,
    placelist,
    talkroom,
    // placedetail,
  },
  data() {
    return {
      // ------------------------------
      // プロフィール更新 画像の一時データ
      // ------------------------------
      update: {
        avatar_image: "",
        cover_image: "",
      },
      userDataTemporary: [],

      // ------------------------------
      // アカウント情報の更新
      // ------------------------------
      // パスワード
      changePassword: {
        dialog: false,
        formatCheck: false,
        notice: [],
        password: '',
        password_confirmation: '',
        process: '',
      },

      // Eメールアドレス
      changeEmail: {
        dialog: false,
        formatCheck: false,
        notice: [],
        email: '',
        process: '',
      },

      // ------------------------------
      // エリア変更用の一時データ
      // ------------------------------
      areaChangeData: {
        prefecture: null,
        area_id: null,
        areaList: [],
        place_id: null,
        placeList: [],
        err: {
          area: false,
          place: false,
        },
      },

      // ------------------------------
      // ネットワーク接続のチェック用
      // ------------------------------
      // ネットの接続状態
      isOnline: navigator.onLine,
      // サーバーとの接続状態
      // ※クッキーがない場合のログインでは表示させないため、最初はtrueに。
      isAvailable: true,

      // ------------------------------
      // localhost のチェック用
      // ------------------------------
      isLocalhost: document.domain=='localhost',

      // ------------------------------
      // デバッグ
      // ------------------------------
      // コーディングプレビュー
      preview: true,

      // 通信のデバッグ
      prossessData: {
        show: true,
        item: [],
      },
      // 最後のデフォルトデータの読み込み完了の判別
      talkCompletedCount: 0,
      userCompletedCount: 0,
      completedCount: 0,
      allEventCount: 0,
      // イベントごとのトーク一覧とユーザー一覧から
      // 表示用のトークデータの作成をはじめた瞬間に 'starting'
      // 完了したら 'finished'
      talkDataCreate: 'waiting',
      // 最初のローディングが終わったら true
      loadCompleted: false,
      loadCompletedAnimate: false,
      successCount: 0,
      progressRate: 0,
      progressToHundred: 0,
      progressRateTweened: 0,
      statusLog: false,
      errorCount: 0,
      retryCount: 0,
      // progressRateAnimated: 0,

      messageFocus: false,

      // ------------------------------
      // 画像プレビュー用
      // ------------------------------
      avatar_image_preview: "",
      cover_image_preview: "",

      // ------------------------------
      // 新規登録
      // ------------------------------
      newReg: {
        nickname: "",
        avatar_image: "",
        cover_image: "",
        fashion: "",
        area_id: "",
        current_place_id: "",
        gender: "",
        blood: "",
        age: "",
        height: "",
        birthplace: "",
        tobacco: "",
        alcohol: "",
        business: "",
        education: "",
        attracted_type: "",
        hobbies: "",
        income: "",
      },

      // ------------------------------
      // ユーザー登録（主に画像）
      // ------------------------------
      usrReg: {
        avatar_image: "",
        cover_image: "",
      },

      // ------------------------------
      // 会場登録（主に画像）
      // ------------------------------
      plcReg: {
        avatar_image: "",
        cover_image: "",
      },

      // ------------------------------
      // プリローダー表示切り替え用
      // ------------------------------
      loaded: false,
      loadErr: {
        show: false,
        title: "",
        content: "",
      },

      // ------------------------------
      // ログイン
      // ------------------------------
      // ログイン画面
      loginForm: {
        input: true,
        resetPassword: false,
        newRegist: false,
        transaction: false,
        msg: "",
        debug: "",
        debugDefault: "",
      },
      // メールアドレスのバリデーション用
      // regexp: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
      regexp: /^[a-zA-Z0-9_\.\-\+]+?@[A-Za-z0-9_\.\-]+$/,
      // パスワードのバリデーション用
      pwReg: /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
      // 半角文字のバリデーション用
      hankakuReg: /^[\x20-\x7e]*$/,
      // ログイン後
      authKey: "",

      // ------------------------------
      // 仮登録
      // ------------------------------
      // 仮登録画面でのエラー確認
      regTmp: {
        msg: "",
        debug: "",
      },

      // ------------------------------
      // ユーザー用ログインデータ
      // ------------------------------
      userLogIn: {
        email: "",
        password: "",
        password_conf: "",
      },
      userLogInLoad: false,

      // ------------------------------
      // ユーザーの登録データ格納用
      // ------------------------------
      userData: [],
      userResponce: '',

      // ------------------------------
      // ユーザーリスト格納用
      // ------------------------------
      userListDefault: [],
      userList: [],
      // モーダル表示用
      userDetail: [],

      // ------------------------------
      // ペイン1のタブ切り替え用データ
      // ------------------------------
      // アクティブのタブの初期値
      currentId1: 'place',

      // タブの表示用
      pane1: [
        {
          id: 'place',
          label: 'place',
        },
        {
          id: 'event',
          label: 'event',
        },
        {
          id: 'placedetail',
          label: 'placedetail',
        },
      ],

      // ------------------------------
      // ペイン2のタブ切り替え用データ
      // ------------------------------
      // アクティブのタブの初期値
      currentId2: 'all',

      // タブの表示用
      pane2: [
        {
          id: 'all',
          label: 'all',
        },
        {
          id: 'male',
          label: 'men',
        },
        {
          id: 'female',
          label: 'women',
        },
      ],

      // ------------------------------
      // トークリスト表示用データ
      // ------------------------------
      // 初期トークリスト格納用（恒久的に変えない）
      talklistData: [],
      talklistDefault: [],
      talklistTmp: [],
      // talklistTmp_: [],

      // 会場絞り込み前のトークリスト（動的に変わる）
      talklistAll: [],
      // 使用されるトークリスト（動的に変わる）
      talklist: [],
      noResultTalk: {
        all: false,
        male: false,
        female: false,
      },

      // ------------------------------
      // 現在のエリア
      // ------------------------------
      currentAreaId: '',
      currentAreaName: '',

      // ------------------------------
      // イベントリスト表示用データ
      // ------------------------------
      // 現在のイベントリスト格納用
      noweventlist: [],
      noweventlistTmp: [],

      // 過去のイベントリスト格納用
      pasteventlist: [],

      // 全イベント格納用
      alleventlist: [],

      // ------------------------------
      // 会場リスト表示用データ
      // ------------------------------
      // 会場リスト格納用
      placelist: [],
      placelistTmp: [],

      // ------------------------------
      // トークルーム表示用データ
      // ------------------------------
      // トークルームローディング
      talkroomLoad: false,
      talkroomErr: "",

      // 初期トークルーム格納用
      talkroomDefault: [],
      talkroomTmp: [],

      // 使用されるトークルーム（動的に変わる）
      talkroom: [],
      talkroomPage: 1,
      talkroomPageLoad: false,

      // ------------------------------
      // 現在表示されているトークユーザ
      // ------------------------------
      currentUserName: '',
      currentPartner: [],

      // ------------------------------
      // モーダル
      // ------------------------------
      modal: {
        checkIn: false,
        userDetail: false,
        userLogIn: true,
        userEdit: false,
        userAdd: false,
        placeEdit: false,
        placeAdd: false,
        eventEdit: false,
        eventAdd: false,
        infoEdit: false,
        infoAdd: false,
        helpEdit: false,
        helpAdd: false,
        adminDetail: false,
        areaChange: false,
        deleteAccount: false,
      },

      // ------------------------------
      // トースト
      // ------------------------------
      toast: {
        show: false,
        title: "",
        lead: "",
        accept: false,
      },

      // ------------------------------
      // 通知
      // ------------------------------
      notice: {
        show: false,
        title: "",
        lead: "",
      },

      // ------------------------------
      // リアルタイム用
      // ------------------------------
      receive: {
        show: false,
        id: "",
        event_id: "",
        label: "",
        avatar_image: "",
        nickname: "",
        age: "",
        gender: "",
        blood: "",
        body: "",
        annotat: "",
      },

      // ------------------------------
      // チェックインコード
      // ------------------------------
      checkinTargetEvent: '',
      checkincode: '',
      checkinErr: {
        code: false,
        place: false,
        fashion: false,
        placeErr: false,
      },
      checkinLoad: false,

      // ------------------------------
      // 会場絞り込み用のデータ
      // ------------------------------
      // イベントIDの初期値
      eventID: '',
      // イベントリストでクリックしたアイテムのイベントID
      currentEventID: '',
      currentEvent: [],
      // 会場の詳細
      placeDetail: [],
      // チェックインした、またはプルダウンから選択した会場ID
      currentPlaceID: '',
      // 現在いる会場ID
      nowPlaceID: '',
      // 会場の詳細を変更するか
      switchPlace: false,
      switchPlaceID: {
        before: '',
        after: '',
      },
      behind_unread: 0,

      // ------------------------------
      // トークルーム
      // ------------------------------
      // 現在表示されているトーク相手
      currentPartnerID: '',
      // 現在表示されているトークルーム
      currentTalkID: '',
      // メッセージ
      send_message: '',
      messageBrCount: 0,

      // ------------------------------
      // Action Cable Channel
      // ------------------------------
      messageChannel: null,

      // ------------------------------
      // 送信中
      // ------------------------------
      sending: false,

      // ------------------------------
      // 音
      // ------------------------------
      audio: {
        init: false,
        notice: 'notice1',
        updated: 'updated1',
        volume: 0.5,
      },

      // ------------------------------
      // テーマ
      // ------------------------------
      theme: {
        mode: '',
        color: '',
      },

      // ------------------------------
      // レイアウト
      // ------------------------------
      layout: {
        frame: 'default',
        own_avatar: 'hide',
      },

      // ------------------------------
      // 都道府県
      // ------------------------------
      prefectureAll: [],
      prefecture: [],
      prefectureChanged: false,

      // ------------------------------
      // エリア
      // ------------------------------
      // areaListAll: [],
      areaList: [],
      areaListLoad: false,
      placeListLoad: false,

    }
  },

  beforeCreate() {
  },
  created() {

    // ------------------------------
    // クッキーにAuthorizationがある場合
    // ------------------------------
    if (this.$cookie.get('Authorization')) {
      // 1.ユーザー情報の取得を試す
      this.getUserData()
      // // 2. 都道府県を取得
      // this.getPrefecture()
      // ▲ getUserData → setUserData の API 内で実行
    } else {
      // 画面作製のAPI進行状況を非表示にする
      this.prossessData.show = false
      this.getPrefecture()
    }

    // ------------------------------
    // クッキーにセッティング項目がある場合
    // ------------------------------
    // 1. audio 関連
    if (this.$cookie.get('audio_notice')) {
      this.audio.notice = this.$cookie.get('audio_notice')
    }
    if (this.$cookie.get('audio_updated')) {
      this.audio.updated = this.$cookie.get('audio_updated')
    }
    // if (this.$cookie.get('audio_volume')) {
    //   this.audio.volume = this.$cookie.get('audio_volume')
    // }

    // 2. テーマ関連
    if (this.$cookie.get('theme_mode')) {
      this.theme.mode = this.$cookie.get('theme_mode')
    }
    if (this.$cookie.get('theme_color')) {
      this.theme.color = this.$cookie.get('theme_color')
    }

    // 3. レイアウト関連
    if (this.$cookie.get('layout_own_avatar')) {
      this.layout.own_avatar = this.$cookie.get('layout_own_avatar')
    }
  },

  mounted() {
    if (location.pathname === '/') {
      location.href = '/user/'
    }
    if (!this.$cookie.get('Authorization')) {
      this.loaded = true
    }

    // パラメータの確認
    let query = _.chain(window.location.search)
        .replace('?', '')
        .split('&')
        .map(_.partial(_.split, _, '=', 2))
        .fromPairs()
        .value();
    if (query['mode'] === 'register') {
      this.registShow();
    }

    // ------------------------------
    // エリア一覧の作成
    // ------------------------------

    if (this.layout.own_avatar=='show') {
      $('body').removeClass('is-own-hide')
    } else {
      $('body').addClass('is-own-hide')
    }
  },

  methods: {
    // ------------------------------
    // Auto-Play Blocking の解除用
    // - PC : Safari
    // - SP : Android Chrome
    // - SP : iOS Safari
    // ------------------------------
    soundInit() {
      if (this.audio.init==false) {
        // this.LOG('ƒ soundInit:Starting')
        let allsound = ['mute','notice1','notice2','notice3','notice4','updated1','updated2','updated3','updated4']
        allsound.forEach((target, index) => {
          const audio = document.getElementById(target)
          // audio.volume = 0
          audio.muted = true
          setTimeout(() => {
            audio.play()
          }, 10)
          setTimeout(() => {
            audio.pause()
            audio.currentTime = 0
          }, 20)
          setTimeout(() => {
            if (this.$cookie.get('audio_volume')) {
              audio.volume = this.$cookie.get('audio_volume')
              this.audio.volume = audio.volume
            }
            audio.muted = false
          }, 1000)
        })
        setTimeout(() => {
          this.audio.init = true
        }, 1500)
      }
    },

    // ------------------------------
    // メールアドレスの確認
    // ------------------------------
    emailCheck() {
      this.changeEmail.process = ''
      let email = this.changeEmail.email
      let emailTest = this.regexp.test(email)
      if (emailTest) {
        // フォーマットOKの場合
        this.changeEmail.notice = []
        this.changeEmail.formatCheck = true
        this.changeEmail.notice.unshift('入力したEメールアドレスに確認メールが送信されます。')
      } else {
        // フォーマットNGの場合
        this.changeEmail.notice = []
        this.changeEmail.notice.unshift('入力したEメールアドレスの形式に誤りがあります。')
        this.changeEmail.formatCheck = false
      }
      // ダイアログを開く
      this.changeEmail.dialog = true
    },

    // ------------------------------
    // メールアドレスの変更
    // ------------------------------
    emailChange() {
      setTimeout(() => {
        axios({
          method: 'PUT',
          url: BASE_URL + '/users',
          data: {
            email: this.changeEmail.email,
          },
          headers: {
            Authorization: this.$cookie.get('Authorization')
          }
        })
        .then(function() {
          console.log('SUCCESS')
          this.changeEmail.process = 'finished'
          setTimeout(() => {
            this.changeEmail.dialog = false
          }, 20000)
          setTimeout(() => {
            this.changeEmail = {
              process: '',
              notice: [],
              formatCheck: false,
              email: '',
            }
          }, 21000)
        }.bind(this))
        .catch(function(error) {
          console.log(error.response.data);
          console.log('FAILED')
          this.changeEmail.notice[0] = error.response.data.error.message
          this.changeEmail.process = 'error'
        }.bind(this))
      }, 1000)
    },

    // ------------------------------
    // オーディオ・テーマ・レイアウトの変更
    // ------------------------------
    settingChange() {
      // 1. オーディオ関連
      this.$cookie.set(
        'audio_notice',
        this.audio.notice,
      )
      this.$cookie.set(
        'audio_updated',
        this.audio.updated,
      )
      this.$cookie.set(
        'audio_volume',
        this.audio.volume,
      )

      // テーマ関連
      this.$cookie.set(
        'theme_mode',
        this.theme.mode,
      )
      this.$cookie.set(
        'theme_color',
        this.theme.color,
      )

      // レイアウト関連
      this.$cookie.set(
        'layout_own_avatar',
        this.layout.own_avatar,
      )

    },

    // ------------------------------
    // 退会処理
    // ------------------------------
    deleteAccount() {
      const result = confirm('本当に退会しますか？');

      if (result) {
        axios({
          method: 'DELETE',
          url: BASE_URL + '/registrations',
          headers: {
            Authorization: this.$cookie.get('Authorization')
          }
        })
        .then(function() {
          this.userData = null
          this.$cookie.delete('Authorization')
          this.reload()
        }.bind(this))
        .catch(function() {
          this.userData = null
          this.$cookie.delete('Authorization')
          this.reload()
        }.bind(this))
      }
    },

    // ------------------------------
    // パスワードの確認
    // ------------------------------
    passwordCheck() {
      this.changePassword.process = ''
      let pass1 = this.changePassword.password
      let pass2 = this.changePassword.password_confirmation
      let passTest1 = this.pwReg.test(pass1)
      let passTest2 = this.pwReg.test(pass2)
      if (passTest1&&passTest2&&pass1==pass2) {
        this.changePassword.notice = []
        this.changePassword.formatCheck = true
        this.changePassword.notice.unshift('以前使用していたパスワードは使用できなくなります。')
      } else {
        this.changePassword.notice = []
        if (!passTest1&&!passTest2) {
          this.changePassword.notice.unshift('パスワードは半角英数字8文字以上で入力して下さい。')
        }
        if (pass1!=pass2) {
          this.changePassword.notice.unshift('確認用のパスワードが一致しません。')
        }
        this.changePassword.formatCheck = false
      }
      // ダイアログを開く
      this.changePassword.dialog = true
    },

    // ------------------------------
    // パスワードの変更（ダイアログ内）
    // ------------------------------
    passwordChange() {
      this.changePassword.process = 'starting'
      setTimeout(() => {
        axios({
          method: 'PUT',
          url: BASE_URL + '/users',
          data: {
            password: this.changePassword.password,
            password_confirmation: this.changePassword.password_confirmation,
          },
          headers: {
            Authorization: this.$cookie.get('Authorization')
          }
        })
        .then(function() {
          console.log('SUCCESS')
          this.changePassword.process = 'finished'
          setTimeout(() => {
            this.changePassword.dialog = false
          }, 6000)
          setTimeout(() => {
            this.changePassword = {
              process: '',
              notice: [],
              formatCheck: false,
              password: '',
              password_confirmation: '',
            }
          }, 7000)
        }.bind(this))
        .catch(function(error) {
          console.log(error.response.data);
          console.log('FAILED')
          this.changePassword.notice[0] = error.response.data.error.message
          this.changePassword.process = 'error'
        }.bind(this))
      }, 1000)
    },

    // ------------------------------
    // メッセージのテキストエリアにフォーカスが当たった場合の調整
    // ------------------------------
    textareaFocus() {
      this.messageFocus = true
      setTimeout(() => {
        this.scrollDown()
      }, 300)
    },

    textareaBlur() {
      this.messageFocus = false
    },

    getUserData(background) {
      // ------------------------------
      // 1.ユーザー情報の取得を試す
      // ------------------------------
      // 進行状況の配列を空にする
      this.prossessData.item.splice(0, this.prossessData.item.length)
      let status = {
        'id': 1,
        'title': 'ユーザー情報の取得',
        'content': 'ユーザー情報を取得しています',
        'error': false,
        'completed': false,
        'log': '',
      }
      this.prossessData.item.unshift(status)
      axios({
        method: 'GET',
        url: BASE_URL + '/users',
        headers: {
          Authorization: this.$cookie.get('Authorization')
        }
      })
      .then(function(response) {
        this.userResponce = response
        if (background) {
          this.setUserData(response,true)
          console.log('バックグラウンド更新:getUserData()');
        } else {
          this.setUserData(response)
        }
        status.content = 'ユーザー情報を取得しました'
        status.error = false
        status.completed = true
      }.bind(this))
      .catch(function(error) {
        console.log(error)
        this.$cookie.delete('Authorization')
        this.loaded = true
        status.content = 'ユーザー情報の取得に失敗しました'
        status.error = true
        status.completed = false
        status.log = error
      }.bind(this))

    },

    reload() {
      window.location.reload()
    },

    retry(statusId) {
      if (statusId==1) {
        this.getUserData()
        this.getPrefecture()
      } else if (statusId==2) {
        this.getPrefecture()
        this.eventListUpdate()
        this.connectWebSocket()
      } else if (statusId==3) {
        this.eventListUpdate()
        this.connectWebSocket()
      } else if (statusId==4) {
        this.connectWebSocket()
        this.placeList()
      } else if (statusId==5) {
        this.placeList()
      } else if (statusId==6) {
        this.pastEventList()
      } else if (statusId>=7) {
        this.defaultData()
      }
    },

    retryCatchErr() {
      this.retryCount++
      let prossessData = this.prossessData.item.slice().reverse()
      let errData = prossessData.filter(function(el){
        return el.error == true
      })
      this.retry(errData[0].id)
    },

    // ------------------------------
    // 都道府県の取得
    // ------------------------------
    getPrefecture() {
      // 進行状況の配列を空にする
      this.prossessData.item.splice(0, this.prossessData.item.length-1)
      let status = {
        'id': 2,
        'title': '都道府県と登録エリアリソースの取得',
        'content': '都道府県と登録エリアリソースを取得しています',
        'error': false,
        'completed': false,
        'log': '',
      }
      this.prossessData.item.unshift(status)

      axios({
        method: 'GET',
        // url: BASE_URL + "/area/prefectures",
        // ※ ▲ ▼ 一旦静的JSONで対応
        url: '../../_assets/files/prefecture.json',
        // headers: {
        //   Authorization: this.$cookie.get('Authorization')
        // },
      })
      .then(function(response) {
        this.prefecture = response.data
        status.content = '都道府県と登録エリアリソースを取得しました'
        status.error = false
        status.completed = true
      }.bind(this))
      .catch(function(error) {
        console.error(error)
        status.content = '都道府県と登録エリアリソースの取得に失敗しました'
        status.error = true
        status.completed = false
        status.log = error

      }.bind(this))
    },

    // ------------------------------
    // 都道府県プルダウンの変更時
    // ------------------------------
    changePrefecture() {
      this.getAreaList(this.areaChangeData.prefecture)
    },

    // ------------------------------
    // 都道府県プルダウンの変更時（新規登録）
    // ------------------------------
    registerPrefecture() {
      this.areaListLoad = true
      axios({
        method: 'GET',
        url: BASE_URL + "/areas",
        // headers: {
        //   Authorization: this.$cookie.get('Authorization')
        // },
        params: {
          prefecture: this.newReg.prefecture,
        },
      })
      .then(function(response) {
        this.areaListLoad = false

        // ▼ ▼ ▼ 登録エリアの変更 プルダウン表示データの作製
        let areaList = response.data
        let listData = []
        let blankData = {
          'text': 'エリアを選択してください',
          'value': null,
          'disabled': true,
        }
        areaList.forEach((item, index) => {
          listData[index] = {}
          listData[index].text = item.name
          listData[index].value = item.id
        })
        let selectedAreaId = this.newReg.area_id
        let targetArea = areaList.filter(function(el){
          return el.id == selectedAreaId
        })
        if (targetArea.length==0) {
          // 選択中のエリアがその県になければ
          blankData = {
            'text': 'エリアを選択してください',
            'value': selectedAreaId,
            'disabled': true,
          }
        }
        if (areaList.length==0) {
          // 選択中の県にエリア自体がそもそもなければ
          blankData = {
            'text': '現在選択中の県にエリアはありません',
            'value': selectedAreaId,
            'disabled': true,
          }
        }
        listData.unshift(blankData)
        this.newReg.areaList = listData
        // ▲ ▲ ▲ 登録エリアの変更 プルダウン表示データの作製

      }.bind(this))
      .catch(function(error) {
        console.error(error)
        this.areaListLoad = false
      }.bind(this))
    },

    // ------------------------------
    // エリア（プルダウン等）の変更時
    // ------------------------------
    changeArea() {
      let areaId = this.areaChangeData.area_id
      this.getPlace(areaId)
    },

    // ------------------------------
    // エリア（プルダウン等）の変更時
    // ------------------------------
    registerArea() {
      let areaId = this.newReg.area_id
      this.placeListLoad = true
      if (areaId>0) {
        // エリアが登録されている時だけ処理させる
        axios({
          method: 'GET',
          url: BASE_URL + '/places',
          headers: {
            Authorization: this.$cookie.get('Authorization')
          },
          params: {
            area_id: areaId,
          },
        })
        .then(function(response) {
          this.placeListLoad = false
          // ▼ ▼ ▼ 会場の移動 プルダウン表示データの作製
          let placeList = response.data
          let listData = []
          let blankData = {
            'text': '会場を選択してください',
            'value': null,
            'disabled': true,
          }
          placeList.forEach((item, index) => {
            listData[index] = {}
            listData[index].text = item.name
            listData[index].value = item.id
            listData[index].area_id = areaId
          })
          let selectedPlaceId = this.newReg.place_id
          let targetPlace = placeList.filter(function(el){
            return el.id == selectedPlaceId
          })
          if (targetPlace.length==0) {
            // 選択中の会場がそのエリアになければ
            blankData = {
              'text': '会場を選択してください',
              'value': selectedPlaceId,
              'disabled': true,
            }
          }
          if (placeList.length==0) {
            // 選択中のエリアに会場自体がそもそもなければ
            blankData = {
              'text': '現在選択中のエリアに会場はありません',
              'value': selectedPlaceId,
              'disabled': true,
            }
          }
          listData.unshift(blankData)
          this.newReg.placeList = listData
          // ▲ ▲ ▲ 会場の移動 プルダウン表示データの作製
        }.bind(this))
        .catch(function(error) {
          console.error(error)
          this.placeListLoad = false
        }.bind(this))
      } else {
        // エリアが未登録のユーザー
      }

    },

    // ------------------------------
    // エリア（プルダウン等）の変更時
    // ------------------------------
    changePlace() {
      // this.placeCheckIn(this.userDataTemporary.current_place_id)
    },

    // ------------------------------
    // エリアIDから会場一覧を取得
    // ------------------------------
    getPlace(areaId) {
      this.placeListLoad = true
      if (areaId>0) {
        // エリアが登録されている時だけ処理させる
        axios({
          method: 'GET',
          url: BASE_URL + '/places',
          params: {
            area_id: areaId,
          },
        })
        .then(function(response) {
          // 会場変更用データを更新
          this.placelistTmp = response.data
          this.placeListLoad = false

          // ▼ ▼ ▼ 会場の移動 プルダウン表示データの作製
          let placeList = response.data
          let listData = []
          let blankData = {
            'text': '会場を選択してください',
            'value': null,
            'disabled': true,
          }
          placeList.forEach((item, index) => {
            listData[index] = {}
            listData[index].text = item.name
            listData[index].value = item.id
            listData[index].area_id = areaId
          })
          let selectedPlaceId = this.areaChangeData.place_id
          let targetPlace = placeList.filter(function(el){
            return el.id == selectedPlaceId
          })
          if (targetPlace.length==0) {
            // 選択中の会場がそのエリアになければ
            blankData = {
              'text': '会場を選択してください',
              'value': selectedPlaceId,
              'disabled': true,
            }
          }
          if (placeList.length==0) {
            // 選択中のエリアに会場自体がそもそもなければ
            blankData = {
              'text': '現在選択中のエリアに会場はありません',
              'value': selectedPlaceId,
              'disabled': true,
            }
          }
          listData.unshift(blankData)
          this.areaChangeData.placeList = listData
          // ▲ ▲ ▲ 会場の移動 プルダウン表示データの作製
        }.bind(this))
        .catch(function(error) {
          console.error(error)
          this.placeListLoad = false
        }.bind(this))
      } else {
        // エリアが未登録のユーザー
      }
    },

    // ------------------------------
    // 都道府県に属しているエリアの取得
    // ------------------------------
    // areaChangeData
    getAreaList(val) {
      let before = _.clone(this.userData.prefecture)
      this.areaListLoad = true
      axios({
        method: 'GET',
        url: BASE_URL + "/areas",
        headers: {
          Authorization: this.$cookie.get('Authorization')
        },
        params: {
          prefecture: val,
        },
      })
      .then(function(response) {
        this.areaList = response.data
        let after = null
        if (this.areaList.length) {
          after = this.areaList[0].prefecture
        }
        if ( before == after ) {
          this.prefectureChanged = false
        } else {
          this.prefectureChanged = true
        }
        this.areaListLoad = false

        // ▼ ▼ ▼ 登録エリアの変更 プルダウン表示データの作製
        let areaList = response.data
        let listData = []
        let blankData = {
          'text': 'エリアを選択してください',
          'value': null,
          'disabled': true,
        }
        areaList.forEach((item, index) => {
          listData[index] = {}
          listData[index].text = item.name
          listData[index].value = item.id
        })
        let selectedAreaId = this.areaChangeData.area_id
        let targetArea = areaList.filter(function(el){
          return el.id == selectedAreaId
        })
        if (targetArea.length==0) {
          // 選択中のエリアがその県になければ
          blankData = {
            'text': 'エリアを選択してください',
            'value': selectedAreaId,
            'disabled': true,
          }
        }
        if (areaList.length==0) {
          // 選択中の県にエリア自体がそもそもなければ
          blankData = {
            'text': '現在選択中の県にエリアはありません',
            'value': selectedAreaId,
            'disabled': true,
          }
        }
        listData.unshift(blankData)
        this.areaChangeData.areaList = listData
        // ▲ ▲ ▲ 登録エリアの変更 プルダウン表示データの作製

      }.bind(this))
      .catch(function(error) {
        console.error(error)
        this.areaListLoad = false
      }.bind(this))
    },

    // ------------------------------
    // 会場詳細内のボタンでの会場の切り替え
    // ------------------------------
    placeIn(placeId) {
      let nowPlaceId = this.userData.current_place_id
      if (placeId != nowPlaceId) {
        this.placeCheckIn(placeId)
      }
    },

    // ------------------------------
    // 登録エリア変更ダイアログ上の処理
    // ------------------------------
    areaChange() {
      let B = {
        'area': this.userData.area_id,
        'place': this.userData.current_place_id,
      }
      let A = {
        'pref': this.areaChangeData.prefecture,
        'area': this.areaChangeData.area_id,
        'place': this.areaChangeData.place_id,
      }
      let ERR = {
        'area': false,
        'place': false,
      }

      // エリアの変更が行われていない場合
      if (A.area==B.area||A.area==''||A.area==null) {
        ERR.area = true
        this.areaChangeData.err.area = true
      } else {
        this.areaChangeData.err.area = false
      }

      // 会場の変更が行われていない場合
      if (A.place==B.place||A.place==''||A.place==null) {
        ERR.place = true
        this.areaChangeData.err.place = true
      } else {
        let match = 0
        this.areaChangeData.placeList.forEach((item, index) => {
          if (index>0&&item.value==A.place) { match++ }
        })
        if (match>0) {
          // 選択した会場が選択したエリアの中にある場合
          this.areaChangeData.err.place = false
        } else {
          // 選択した会場が選択したエリアの中にない場合
          this.areaChangeData.err.place = true
        }
      }

      // エリア・会場のいずれも変更がされている時に処理を実行
      if (ERR.area==false&&this.areaChangeData.err.place==false) {
        // console.log('OK');
        this.prefectureAreaChange(A.pref,A.area,A.place)
      } else {
        // console.log('NG');
      }
    },

    // ------------------------------
    // 登録エリアの変更や設定で使用する
    // ------------------------------
    prefectureAreaChange(PREF,AREA,PLACE) {


      // 県・エリアの変更はプロフ更新API
      let data = new FormData();
      let USERDATA = {
        "prefecture": PREF,
        "area_id": AREA,
        // "current_place_id": PLACE,
      }
      Object.keys(USERDATA).forEach((key,index) => {
        data.append(key, USERDATA[key])
      })

      this.placeAreaChange(AREA,PLACE)

      setTimeout(() => {
        this.reload()
      }, 2000)
    },

    placeSelect() {
      console.log(e);
      console.log(e.value);
    },

    // ------------------------------
    // エリアと会場の変更
    // ------------------------------
    placeAreaChange(areaID,placeID) {
      this.messageChannel.perform('change_area', {
        area_id: areaID,
        place_id: placeID,
        token: this.$cookie.get('Authorization')
      });
    },

    // ------------------------------
    // イベントにて会場の移動
    // ------------------------------
    placeCheckInAtEvent(placeID) {
      this.messageChannel.perform('checkin_place', {
        place_id: placeID,
        token: this.$cookie.get('Authorization')
      });
    },

    // ------------------------------
    // 音を鳴らす
    // ------------------------------
    soundPlay(target) {
      let id = target
      if (target=='notice') {
        id = this.audio.notice
      }
      if (target=='updated') {
        id = this.audio.updated
      }
      if (id=='off') {
        console.log('soundPlay:off');
      } else {
        let audio = document.getElementById(id)
        audio.volume = this.audio.volume
        audio.play()
      }
    },

    // ------------------------------
    // 現在のトークルームを空白にする
    // ------------------------------
    currentPartnerRefresh() {
      this.currentPartnerID = ""
    },

    // ------------------------------
    // WebSocket(Action Cable)に接続
    // ------------------------------
    connectWebSocket() {
      // 進行状況の配列を空にする
      this.prossessData.item.splice(0, this.prossessData.item.length-3)
      this.isAvailable = false
      let status = {
        'id': 4,
        'title': 'WebSocketの接続',
        'content': 'WebSocket(TCP)サーバとの接続を開始しています。',
        'error': false,
        'completed': false,
        'log': '',
      }
      if (this.isAvailable==true) {
        console.log('メッセージチャンネルに接続されています');
        status.content = 'メッセージチャンネルに接続されています'
        status.error = false
        status.completed = true
      }
      this.prossessData.item.unshift(status)

      this.messageChannel = this.$cable.subscriptions.create({
        channel: "MessageChannel",
        token: this.$cookie.get('Authorization')
      },{
        connected: () => {
          // サブスクリプションがサーバー上で使用できる状態になると
          // 呼び出されます。
          console.log('メッセージチャンネルに接続されました');
          status.content = 'メッセージチャンネルに接続されました'
          status.error = false
          status.completed = true
          this.isAvailable = true
          // ロードが終わった後、接続が切れ再接続された時
          if (this.loadCompleted==true) {
            this.showToast('メッセージチャンネルに接続されました','サーバーと同期中です。しばらくお待ち下さい。','8000')
            this.defaultData()
            // トークルームを閲覧中だった時
            if (this.currentPartnerID!="") {
              this.filterTalk(this.currentPartnerID,this.currentEventID)
            }
          }
        },
        disconnected: () => {
          // WebSocket接続が閉じられたときに呼び出されます。
          console.log('メッセージチャンネルから切断されました');
          status.content = 'メッセージチャンネルから切断されました'
          status.error = true
          status.completed = false
          this.isAvailable = false
        },
        rejected: () => {
          // サブスクリプションがサーバーによって拒否されたときに呼び出されます。
          console.log('メッセージチャンネルから接続が拒否されました');
          status.content = 'メッセージチャンネルから接続が拒否されました'
          status.error = true
          status.completed = false
          this.isAvailable = false
        },
        received: (data) => {
          switch(data['type']) {
            // 1. メッセージを受信
            case 'message':
              this.receiveMessage(data)
              break;
            // 2. イベント参加者を受信
            case 'event_checkedin_user':
              this.receiveJoin(data)
              break;
            // 3. 場所の移動を受信
            case 'place_checkedin_user':
              this.receiveMove(data)
              break;
            default:
              break;
          }
        },
      })

    },

    // ------------------------------
    // リアルタイム関連
    // ------------------------------
    // リアルタイム関連 1. メッセージ送受信
    // [-] 開いている場合はトークルームの更新
    // [-] 別の画面のときはアプリ内通知
    // [-] 未読数の追加（開いている場合は未読ゼロに）の処理
    // ------------------------------
    receiveMessage(data) {
      // 来たデータのパートナーID
      let partnerId = data['partner_id']
      let targetEventId = data.event_id
      // ▼ ▼ ▼ 全トークデータから対象のアイテムを絞り込む
      let targetItemAll = {}
      // console.log(data);
      let targetTalkDataIndex
      let targetTalkAll = this.talklistData.filter(function(el){
        return el.event_id == targetEventId
      })
      let targetEvent
      let targetEventData = this.alleventlist.filter(function(el){
        return el.id == targetEventId
      })
      if (targetEventData.length) {
        targetEvent = targetEventData[0]
      }

      this.talklistData.forEach((item, index) => {
        if (item.event_id==targetEventId) {
          targetTalkDataIndex = index
        }
      })
      if (targetTalkAll.length) {
        let targetItemAllData = targetTalkAll[0].data.filter(function(el){
          return el.partner.id == partnerId
        })
        if (targetItemAllData.length) {
          targetItemAll = targetItemAllData[0]
        } else {
          // まだメッセージのやり取りが発生していない場合の処理
          // エラーは出るが、裏側でデータを更新
          this.createTalks(targetTalkDataIndex,targetEvent,'',0)
        }
      }
      // ▲ ▲ ▲ 全トークデータから対象のアイテムを絞り込む
      // ▼ ▼ ▼ トーク一覧から対象のアイテムを絞り込む
      let targetItem
      if (this.currentEventID==targetEventId) {
        targetItem = this.talklist.filter(function(el){
          return el.partner.id == partnerId
        })
      }
      // ▲ ▲ ▲ トーク一覧から対象のアイテムを絞り込む
      // いま見てるトークルームの相手と、
      // 受信したデータのパートナーIDが一致するかどうか
      // 一致していたら・・・
      if (this.currentPartnerID == partnerId && this.currentEventID == targetEventId) {
        // ------------------------------
        // 1. 送信者のトークルームが表示されている場合
        // ------------------------------
        // 1.1. 既読にする
        this.markRead(this.currentTalkID)
        // 1.2. メッセージを読み込む
        this.filterTalk(partnerId,data.event_id)
        // 1.3. 音を鳴らす
        setTimeout(() => {
          this.soundPlay('updated')
        }, 700);
        this.sending = false
        // 送信内容と受信内容が一致した場合、送信内容を空に
        if (data.message==this.send_message) {
          this.send_message = ''
        }
      } else {
        // ------------------------------
        // 2. 送信者のトークルームが表示されていない場合
        // ------------------------------
        // 2.1. データに関連する情報を整理
        let partner = []
        let partnerAll = this.userListDefault.filter(function(el){
          return el.event_id == data.event_id
        })
        if (partnerAll.length) {
          partner = partnerAll[0].data.filter(function(el){
            return el.id == data.partner_id
          })
        }

        let annotation = []
        if (this.currentEventID!=targetEventId) {
          annotation = annotation.concat({'body':'閲覧中のイベント以外からのメッセージ'})
        }
        if (partner.length) {
          if (this.currentPlaceID!=partner[0].current_place_id) {
            annotation = annotation.concat({'body':'閲覧中の会場以外のメンバー'})
          }
        } else {
          annotation = annotation.concat({'body':'登録エリア外の会場のメンバー'})
        }
        let content = {
          id: data.partner_id,
          event_id: data.event_id,
          label: "New Message",
          avatar_image: "",
          nickname: 'エリア外ユーザ（ユーザID'+data.partner_id+'）',
          age: "",
          gender: "",
          blood: "",
          body: data.message,
          annotation: annotation,
        }
        if (partner.length) {
          content.avatar_image = partner[0].avatar_image
          content.nickname = partner[0].nickname
          content.age = partner[0].age
          content.gender = partner[0].gender
          content.blood = partner[0].blood
        }
        // 2.2. 音を鳴らす
        this.soundPlay('notice')
        // 2.3. メッセージ受信の通知を出す
        this.showReceive(content,5000)
        // 2.4. 未読のカウントを増やす
        targetItemAll.unread_count += 1
        if (this.currentEventID==targetEventId) {
          if (targetItem.length) {
            targetItem[0].unread_count += 1
          }
        }
        this.behindUnread()
      }
      // ------------------------------
      // 3. トークルームの表示にかかわらず共通
      // ------------------------------
      // 3.1. ラストメッセージを更新
      if (targetTalkAll.length) {

        if (targetItemAll.unread_count) {
          // メッセージのやり取りがある場合
          targetItemAll.last_message.body = data.message
          if (this.currentEventID==targetEventId) {
            if (targetItem.length) {
              targetItem[0].last_message.body = data.message
            }
          }
        } else {
          // まだメッセージのやり取りをしていない時
          if (this.currentEventID==targetEventId) {
            // 現在閲覧中のイベント内でのメッセージの送受信の場合
            // ------------------------------
            // （全てのトークデータ上では反映されているが、
            // 現在閲覧中のイベントが有る場合は反映がされない）

            // 1. 対象のトークアイテムのラストメッセージを更新
            let targetTalkData = this.talklist.filter(function(el){
              return el.partner.id == partnerId
            })
            if (targetTalkData.length) {
              targetTalkData[0].last_message.body = data.message
            }
            // 2. そのままではデータに不整合が起こるため、
            // トーク一覧のバックグラウンド更新を行う
            setTimeout(() => {
              this.talkListUpdate(targetEventId,false)
            }, 3000);
            console.log('一致');
          } else {
            // 現在閲覧中のイベント外でのメッセージの送受信の場合
            // ------------------------------
            // 全トークデータ上では反映済みなので、ここで更新を行う必要はない
            console.log('不一致');
          }
        }
      }

      this.unreadCount()
    },

    // ------------------------------
    // リアルタイム関連 2. イベント参加者を受信
    // [-] アプリ内に通知
    // [-] トーク一覧にデータを追加
    // ------------------------------
    receiveJoin(data) {
      if(data['user']['id'] === this.userData.id) {
        // ------------------------------
        // 1. 自分が参加した場合
        // ------------------------------
        this.noweventlistTmp[0].is_checked_in = true

        // 自分自身のユーザーデータの更新
        this.userData.current_place_id = this.nowPlaceID
        let placeID = this.nowPlaceID
        let placeData = this.placelist.filter(function(el){
          return el.id == placeID
        })
        this.userData.current_place_name = placeData[0].name

        let NOWPLACE = this.nowPlaceID
        this.currentPlaceID = NOWPLACE

        // チェックインするイベントのユーザーリストのオブジェクトに、
        // 自分のユーザーデータを突っ込む
        let EVENTUSER = this.userListDefault.filter(function(el){
          return el.event_id == data['event_id']
        })
        EVENTUSER[0].data.unshift(this.userData)
        this.talkListUpdate(data['event_id'])

        // 男女のカウントを増やす
        let targetEvent
        let targetEventData = this.alleventlist.filter(function(el){
          return el.id == data.event_id
        })
        if (targetEventData.length) {
          // ▼ ▼ ▼ 通知用
          targetEvent = targetEventData[0]
          if (this.userData.gender=='male') {
            targetEvent.male_count++
          } else {
            targetEvent.female_count++
          }
        }

        // ローダー・エラー通知・モーダルの非表示
        this.checkinLoad = false
        this.checkinErr.placeErr = false
        this.closeModal('checkIn')

        // ペインの移動・チェックインコードのクリア
        this.pane(2,500)
        this.checkincode = ""

      } else {
        // ------------------------------
        // 2. 別のユーザーの場合
        // ------------------------------
        let targetEvent
        let targetEventData = this.alleventlist.filter(function(el){
          return el.id == data.event_id
        })
        if (targetEventData.length) {
          // ▼ ▼ ▼ 通知用
          targetEvent = targetEventData[0]
          // 1. イベント名を取得
          let eventName = targetEvent.name
          if (targetEvent.name == "" ) {
            eventName = moment(targetEvent.start_time).format('MM/DD')+'のイベント（イベントID：'+targetEvent.id+'）'
          }
          let placeData = this.placelist.filter(function(el){
            return el.id == data.place_id
          })
          // 2. 会場名を取得
          let placeName = '未設定'
          if (placeData.length) {
            placeName = placeData[0].name
          }
          // 3. 音を鳴らす
          this.soundPlay('notice')
          // 4. 参加者がきたことを通知
          this.showNotice('新しいメンバー：'+data.user.nickname+'さん',''+eventName+'の会場：'+placeName+'に'+data.user.nickname+'さんが新たに参加しました！',8000)
          // ▲ ▲ ▲ 通知用

          // ▼ ▼ ▼ 保持データ更新用
          // 5. トーク一覧を更新
          let reMount = new Promise((resolve, reject) => {
            resolve(this.defaultData())
          }).then(function(resolve) {
            if (this.currentEventID==data.event_id) {
              this.talkListUpdate(data.event_id)
            }
          }.bind(data))
          .catch(function(error) {
            console.error(err)
          }.bind(data))

          if (this.currentEventID==data.event_id) {
            setTimeout(() => {
              this.talkListUpdate(data.event_id,false)
            }, 7000);
          }
        }
      }
    },

    // ------------------------------
    // トーク一覧の再読込（DBと同期）
    // ------------------------------
    talkReload(eventID){
      // 全トーク一覧とユーザー一覧を更新
      this.defaultData()
    },

    // ------------------------------
    // リアルタイム関連 3. 会場の移動者を受信
    // [-] アプリ内に通知
    // [ ] トーク一覧にデータを追加
    // ------------------------------
    receiveMove(data) {
      // ------------------------------
      // 自他共通
      // ------------------------------
      let targetPlace = this.placelist.filter(function(el){
        return el.id == data.place_id
      })
      // 会場名
      let placeName = '会場ID:'+data.place_id
      if (targetPlace.length) {
        placeName = targetPlace[0].name
      } else {
        placeName = '登録エリア外の会場'
      }
      // ユーザー名
      let userName = 'ユーザーID:'+data.user_id
      let movedUser = {}
      this.userListDefault.forEach((item, index) => {
        let movedUserData = this.userListDefault[index].data.filter(function(el){
          return el.id == data.user_id
        })
        if (movedUserData.length) {
          movedUser = movedUserData[0]
          userName = movedUserData[0].nickname
          let lastPlaceId = _.clone(movedUserData[0].current_place_id)
          movedUserData[0].last_place_id = lastPlaceId
          setTimeout(() => {
            movedUserData[0].current_place_id = data.place_id
            movedUserData[0].current_place_name = placeName
          }, 100);
        }
      })
      this.talklistData.forEach((item, index) => {
        let target = this.talklistData[index].data.filter(function(el){
          return el.partner.id == data.user_id
        })
        if (target.length) {
          let lastPlaceId = _.clone(target[0].partner.current_place_id)
          target[0].partner.last_place_id = lastPlaceId
          setTimeout(() => {
            target[0].partner.current_place_id = data.place_id
            target[0].is_moved = true
            this.talkListFilterPlace()
            if (data.place_id==this.currentPlaceID) {
              target[0].is_current_place = true
            } else {
              target[0].is_current_place = false
            }
          }, 100);
        }
      })
      this.talklist.forEach((item, index) => {
        if (this.talklist[index].partner.id==data.user_id) {
          let target = this.talklist[index]
          let lastPlaceId = _.clone(target.partner.current_place_id)
          target.partner.last_place_id = lastPlaceId
          // 会場一覧に会場IDがあるか判別するためのオブジェクト
          let placeData = this.placelist.filter(function(el){
            return el.id == data.place_id
          })
          setTimeout(() => {
            target.partner.current_place_id = data.place_id
            target.is_moved = true
            // いま閲覧中の会場かどうか
            if (data.place_id==this.currentPlaceID) {
              target.is_current_place = true
            } else {
              target.is_current_place = false
            }
            // エリア外の会場かどうか
            if (placeData.length) {
              target.is_other_area = false
            } else {
              target.is_other_area = true
            }
            this.talkListFilterPlace()
          }, 100);
        }
      })

      this.unreadCount()

      if(data.user_id === this.userData.id) {
        // ------------------------------
        // 1. 自分が移動した場合
        // ------------------------------
        this.currentPlaceID = data.place_id
        this.userData.current_place_id = data.place_id
        this.showNotice(placeName+'に移動しました','','2000')
      } else {
        // ------------------------------
        // 2. 別のユーザーが移動した場合
        // ------------------------------
        this.showNotice(userName+'さんが'+placeName+'に移動しました','','2000')
      }
    },

    // ------------------------------
    // 現在の会場の設定（新規登録時のみ）
    // ------------------------------
    placeSetting(placeId) {
      axios({
        method: 'POST',
        url: BASE_URL + '/places/'+placeId+'/checkin',
        headers: {
          Authorization: this.$cookie.get('Authorization')
        },
      })
      .then(function(response) {
        this.currentPlaceID = placeId
      }.bind(this))
      .catch(function(error) {
        console.log(error)
      }.bind(this))
    },

    // ------------------------------
    // 会場の移動
    // ------------------------------
    placeCheckIn(placeId) {
      this.placeCheckInAtEvent(placeId)
    },

    // ------------------------------
    // 新着メッセージの通知をタップした時
    // ------------------------------
    messageTap(eventId,partnerId) {
      let before = this.currentEvent.id
      let after = eventId
      let partner = []
      let targetUserData = this.userListDefault.filter(function(el){
        return el.event_id == eventId
      })
      if (targetUserData.length) {
        partner = targetUserData[0].data.filter(function(el){
          return el.id == partnerId
        })
      }

      let content = ''
      if (partner.length==0) {
        // 通知が来たイベントがエリア外のイベントの場合
        content += 'エリア外のイベントからのメッセージです。このトークを表示する場合は、メニューから登録エリアを変更して下さい'
        this.hideReceive()
        setTimeout(() => {
          this.showToast('閲覧できません',content,'10000')
        }, 100);
      } else {
        // 通知が来たイベントが自分のいるエリア内のイベントの場合
        if (this.currentEvent.id>0) {
          // 現在表示しているイベントがある場合
          // （つまりいま閲覧しているトーク一蘭がある場合）
          if (before!=after||this.currentPlaceID!=partner[0].current_place_id) {
            // 受信したメッセージのイベントと、閲覧中のイベントが異なる場合
            // または、いま閲覧中の会場と相手の会場が違う場合
            if (before!=after) {
              // 受信したメッセージのイベントと、閲覧中のイベントが異なる場合
              let beforeEventName = this.currentEvent.name
              if (beforeEventName=="") {
                beforeEventName = moment(this.currentEvent.start_time).format('MM/DD')
                // beforeEventName = 'イベントID:'+before
              }
              let afterEventData = this.alleventlist.filter(function(el){
                return el.id == eventId
              })[0]
              let afterEventName = afterEventData.name
              if (afterEventName=="") {
                afterEventName = moment(afterEventData.start_time).format('MM/DD')
              }
              content += '・現在閲覧中のイベントは'+ afterEventName +'に変更されました'
            }
          }
        }
        if (this.currentPlaceID!=partner[0].current_place_id) {
          content += '・現在閲覧中の会場は'+ partner[0].current_place_name +'に変更されました'
          this.currentPlaceID=partner[0].current_place_id
        }
        if (content!='') {
          this.showToast('注意',content,'10000')
        }

        // ------------------------------
        // トークルームを移動させる
        // ------------------------------
        let talkRoomMove = new Promise((resolve, reject) => {
          // まずはいまのトーク一覧を受信したメッセージが属するイベントに属するトーク一覧に更新しておく
          resolve(this.talkListUpdate(eventId))
        })
        talkRoomMove.then(() => {
          // 1秒後にトークルームを表示する
          setTimeout(() => {
            this.filterTalk(partnerId,eventId,true)
          }, 1000);
        }).then(() => {
          // 通知を非表示
          this.hideReceive()
        }).catch((err) => {
          console.error(err)
        })
      }
    },

    // ------------------------------
    // ログインユーザーのデータを設定する
    // ------------------------------
    setUserData(response,background) {
      this.userData = response.data
      this.userDataTemporary = _.clone(response.data)
      // ▼ ▼ ▼ エリア変更用
      this.areaChangeData.prefecture = _.clone(response.data.prefecture)
      this.areaChangeData.area_id = _.clone(response.data.area_id)
      this.areaChangeData.place_id = _.clone(response.data.current_place_id)
      // 都道府県を取得
      if (background!=true) {
        // バックグラウンド更新ではない時
        this.getPrefecture()
      } else {
        // バックグラウンド更新時
      }
      // ▲ ▲ ▲ エリア変更用
      this.loginForm.msg = ""

      if (background!=true) {
        // バックグラウンド更新ではない時
        if (!this.$cookie.get('Authorization')) {
          // レスポンスのヘッダーのオーソリゼーション
          this.$cookie.set('Authorization', response.headers.authorization,　{ expires: '1M' });
          // 会場を取得
          this.getPlace(this.areaChangeData.area_id)
        } else {
          // 会場を取得
          this.getPlace(this.areaChangeData.area_id)
        }
      }

      console.log(response.data.nickname);

      this.loginForm.input = false
      this.loginForm.pendingRegist = false
      this.loginForm.newRegist = false
      this.loginForm.resetPassword = false

      if (this.userData.is_confirmed) {
        // メール認証済みユーザーの場合
        if (this.userData.nickname) {
          this.currentPlaceID = this.userData.current_place_id
          if (background!=true) {
            // バックグラウンド更新ではない時
            this.eventListUpdate()
            this.connectWebSocket()
          } else {
            // バックグラウンド更新の時
            setTimeout(() => {
              this.defaultData()
            }, 10000);
          }
          this.modal.userLogIn = false
        } else {
          if (location.pathname !== '/user/regist/') {
            location.href = '/user/regist/'
          }
        }
      } else {
        // メール認証が済んでいないユーザーの場合
        this.loaded = true
        this.loginForm.pendingRegist = true
      }


    },

    // ------------------------------
    // 現在のエリア名取得
    // ------------------------------
    setAreaName() {
      let currentAreaId = this.areaChangeData.area_id
      let currentAreaName = 'エリア名称が見つかりません'
      let areaData = this.areaList.filter(function(el){
        return el.id == currentAreaId
      })
      if (areaData.length) {
        currentAreaName = areaData[0].name
      }
      this.currentAreaId = currentAreaId
      this.currentAreaName = currentAreaName
    },

    // ------------------------------
    // ユーザー登録
    // ------------------------------
    registShow() {
      this.loginForm.input = false
      this.loginForm.newRegist = true
      this.loginForm.resetPassword = false
      this.loginForm.pendingRegist = false
    },

    // ------------------------------
    // ログイン画面表示
    // ------------------------------
    loginShow() {
      this.loginForm.input = true
      this.loginForm.newRegist = false
      this.loginForm.resetPassword = false
      this.loginForm.pendingRegist = false
      this.userLogInLoad = false
    },

    // ------------------------------
    // アバター画像（登録）
    // ------------------------------
    regAvatar(e) {
      let files = e.target.files || e.dataTransfer.files
      this.newReg.avatar_image = files[0]
      this.addPreviewAva(files[0])
    },

    addPreviewAva(file) {
      let reader = new FileReader()
      let vm = this
      reader.onload = (e) => {
        vm.avatar_image_preview = e.target.result
      }
      reader.readAsDataURL(file)
    },

    // ------------------------------
    // カバー画像（登録）
    // ------------------------------
    regCover(e) {
      let files = e.target.files || e.dataTransfer.files
      this.newReg.cover_image = files[0]
      this.addPreviewCov(files[0])
    },

    addPreviewCov(file) {
      let reader = new FileReader()
      let vm = this
      reader.onload = (e) => {
        vm.cover_image_preview = e.target.result
      }
      reader.readAsDataURL(file)
    },

    // ------------------------------
    // アバター画像（変更）
    // ------------------------------
    chgAvatar(e) {
      let files = e.target.files || e.dataTransfer.files
      if (files.length) {
        this.userDataTemporary.avatar_image = files[0]
        this.addChgAva(files[0])
      }
    },

    addChgAva(file,model) {
      let image = new Image()
      let reader = new FileReader()
      let vm = this
      reader.onload = (e) => {
        // vm.userData.avatar_image = e.target.result
        vm.avatar_image_preview = e.target.result
      }
      reader.readAsDataURL(file)
    },

    // ------------------------------
    // カバー画像（変更）
    // ------------------------------
    chgCover(e) {
      let files = e.target.files || e.dataTransfer.files
      if (files.length) {
        this.userDataTemporary.cover_image = files[0]
        this.addChgCov(files[0])
      }
    },

    addChgCov(file,model) {
      let image = new Image()
      let reader = new FileReader()
      let vm = this
      reader.onload = (e) => {
        // vm.userData.cover_image = e.target.result
        vm.cover_image_preview = e.target.result
      }
      reader.readAsDataURL(file)
    },

    // ------------------------------
    // 会場アバター画像（登録）
    // ------------------------------
    plcAvatar(e) {
      let files = e.target.files || e.dataTransfer.files
      this.addPlcAva(files[0])
    },

    addPlcAva(file,model) {
      let image = new Image()
      let reader = new FileReader()
      let vm = this
      reader.onload = (e) => {
        vm.plcReg.avatar_image = e.target.result
      }
      reader.readAsDataURL(file)
    },

    // ------------------------------
    // 会場カバー画像（登録）
    // ------------------------------
    plcCover(e) {
      let files = e.target.files || e.dataTransfer.files
      this.addPlcCov(files[0])
    },

    addPlcCov(file,model) {
      let image = new Image()
      let reader = new FileReader()
      let vm = this
      reader.onload = (e) => {
        vm.plcReg.cover_image = e.target.result
      }
      reader.readAsDataURL(file)
    },

    // ------------------------------
    // ユーザーアバター画像（登録）
    // ------------------------------
    usrAvatar(e) {
      let files = e.target.files || e.dataTransfer.files
      this.addUsrAva(files[0])
    },

    addUsrAva(file,model) {
      let image = new Image()
      let reader = new FileReader()
      let vm = this
      reader.onload = (e) => {
        vm.usrReg.avatar_image = e.target.result
      }
      reader.readAsDataURL(file)
    },

    // ------------------------------
    // ユーザーカバー画像（登録）
    // ------------------------------
    usrCover(e) {
      let files = e.target.files || e.dataTransfer.files
      this.addUsrCov(files[0])
    },

    addUsrCov(file,model) {
      let image = new Image()
      let reader = new FileReader()
      let vm = this
      reader.onload = (e) => {
        vm.usrReg.cover_image = e.target.result
      }
      reader.readAsDataURL(file)
    },

    // ------------------------------
    // メッセージの送信
    // ------------------------------
    messageSend() {
      const targetElm = document.querySelector('#autoHeightInput')
      targetElm.focus()
      if (this.send_message != '') {
        this.sending = true
        this.messageChannel.perform('create_message', {
          event_id: this.currentEventID,
          partner_id: this.currentPartnerID,
          body: this.send_message,
          token: this.$cookie.get('Authorization')
        })
        // this.send_message = ''
      }
      // $('#autoHeightInput').focus()
    },

    // ------------------------------
    // メッセージを既読にする
    // ------------------------------
    markRead(talkID) {
      if (talkID != '') {
        // 1. API側
        let markReadUrl = BASE_URL + "/talks/" + talkID + "/read"
        axios({
          method: 'PUT',
          url: markReadUrl,
          headers: {
            Authorization: this.$cookie.get('Authorization')
          }
        })
        .then(function(response) {
          // // ※ 一旦 filterTalk を処理させているが…
          // this.filterTalk(this.currentPartnerID)
          // this.send_message = ''
          this.unreadCount()
        }.bind(this))
        .catch(function(error) {
          console.error(error)
        }.bind(this))

        // 2. フロントエンド側
        // ▼ ▼ ▼ 全トークデータから対象のアイテムを絞り込む
        this.talklistData.forEach((item, index) => {
          let talks = this.talklistData[index].data.filter(function(el){
            return el.id == talkID
          })
          if (talks.length) {
            talks[0].unread_count = 0
          }
        })
        // ▲ ▲ ▲ 全トークデータから対象のアイテムを絞り込む
        // ▼ ▼ ▼ トーク一覧から対象のアイテムを絞り込む
        let targetItem = this.talklist.filter(function(el){
          return el.id == talkID
        })[0]
        // ▲ ▲ ▲ トーク一覧から対象のアイテムを絞り込む
        // targetItemAll.unread_count = 0
        targetItem.unread_count = 0
      }
    },

    // ------------------------------
    // 表示されている会場以外の未読カウント
    // ------------------------------
    behindUnread() {
      let active = this.talklist.filter(function(el){
        return el.is_current_place == false
      })
      let count = 0
      active.forEach((item, index) => {
        count += active[index].unread_count
      })
      this.behind_unread = count
    },

    placeUnreadByEvent() {
      this.placelist.forEach((item, index) => {
        // this.placelist[index].current_unread_badge = 0
        let count = 0
        let placeId = this.placelist[index].id
        let targetTalk = this.talklist.filter(function(el){
          return el.partner.current_place_id == placeId
        })
        targetTalk.forEach((item_, index_) => {
          count += this.talklist[index_].unread_count
        })
        this.placelist[index].current_unread = count
        // if (count>0) {
        //   this.placelist[index].current_unread_badge = '['+count+'通]'
        // }
      })
    },

    // ------------------------------
    // トークルームの無限スクロール
    // ------------------------------
    talkRoomPaging(partnerId) {
      const target = document.querySelector('.p-scrollable--talk')
      // メッセージが50件だった時

      // 取得したメッセージを付け足す前に、最初の日付の要素を取得しておく
      // ※ 取得したあとでスクロール位置を変更する時の基準にする
      let innerFirstElm, startPoint
      if (this.talkroomPage>1) {
        innerFirstElm = target.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling
        startPoint = innerFirstElm.getBoundingClientRect()
      }

      if (target.scrollTop==0&&this.talkroomPage>1) {

        // ページャー計算用の変数（次ページのページ番号）
        let pageCount = this.talkroomPage
        let messageCount = this.talkroomDefault.length
        let countMax = pageCount * 50

        // 次のページャーがある限り処理可能にする
        if (messageCount+50==countMax&&this.talkroomPageLoad==false) {
          this.talkroomPageLoad = true
          axios({
            method: 'GET',
            url: BASE_URL + "/messages",
            headers: {
              Authorization: this.$cookie.get('Authorization')
            },
            params: {
              event_id: this.currentEventID,
              partner_id: partnerId,
              page: pageCount
            }
          })
          .then(function(response) {
            let addTalkData = response.data
            setTimeout(() => {
              addTalkData.forEach((item, index) => {
                this.talkroomDefault.push(addTalkData[index])
              })
              messageCount = this.talkroomDefault.length
              // target.scrollTop = 200
              countMax = pageCount * 50
              if (messageCount==countMax) {
                // ページャー計算用の変数に次ページ（2）を格納
                this.talkroomPage ++
              }
              // 一瞬後に元の位置にジャンプ
            }, 1000);
            setTimeout(() => {
              // 一瞬後に元の位置にジャンプ
              let jumpPoint = innerFirstElm.getBoundingClientRect()
              target.scrollTop = jumpPoint.top - startPoint.top
              // console.log(jumpPoint.top);
              // console.log(startPoint.top);
              this.talkroomPageLoad = false
            }, 1001);

          }.bind(this))
          .catch(function(error) {
            console.error(error)
            this.talkroomLoad = false
            targetTalkRoom.is_loading = false
            targetTalkRoom.is_error = true
            targetTalkRoom.is_active = false
            this.talkroomErr = "メッセージを読み込めません"
            this.showToast('通信エラー','メッセージを読み込めませんでした。もう一度お試し下さい。','2000')
            this.talkroomPageLoad = false
          }.bind(this))
        }
      }
    },

    // ------------------------------
    // ペイン1のタブ切り替え用メソッド
    // ------------------------------
    // アクティブのタブ変更用メソッド
    active1(id) {
      return this.currentId1 == id
    },
    // アクティブ判定用データにアクティブのIDを入れる
    changeTab1(id) {
      this.currentId1 = id
    },

    // ------------------------------
    // ペイン1のタブ切り替え用メソッド
    // ------------------------------
    // アクティブのタブ変更用メソッド
    active2(id) {
      return this.currentId2 == id
    },
    // アクティブ判定用データにアクティブのIDを入れる
    changeTab2(id) {
      this.currentId2 = id
    },

    // ------------------------------
    // 性別による絞り込み（※調整中）
    // ※ 一旦CSSで表示・非表示切り替えに
    // ------------------------------
    filterGender() {
      this.talklist = this.talklist.filter(function(el){
        return el.gender == 'male'
      })
    },

    forgotPassword() {
      this.loginForm.input = false
      this.loginForm.resetPassword = true
    },

    forgotPasswordCancel() {
      this.loginForm.input = true
      this.loginForm.newRegist = false
      this.loginForm.resetPassword = false
    },

    // ------------------------------
    // 会場による絞り込み
    // ------------------------------
    filterPlace(e) {
      let currentPlaceID = this.currentPlaceID
      if (currentPlaceID=="") {
        this.talklist = this.talklistAll
      } else {
        this.talklist = this.talklistAll.filter(function(el){
          return el.partner.current_place_id == currentPlaceID
        })
      }
    },

    // ------------------------------
    // 会場詳細からの遷移
    // ------------------------------
    setPlaceTalk(eventId,placeId) {
      this.talkListUpdate(eventId)
      this.currentPlaceID = placeId
      this.nowPlaceID = placeId
    },

    // ------------------------------
    // 改行コード変換
    // ------------------------------
    nl2br(str) {
      return str.replace(/\\n|\r\n|\r|\n/g, "<br>");
    },
    nl2lf(str) {
      return str.replace(/\\n|\r\n|\r|\n/g, "&#13;");
    },

    // ------------------------------
    // アバター見つからない時に10初期とイニシャルを表示
    // ------------------------------
    defaultAvatar(str,id) {
      let initial = ''
      if (str) {
        let colorNum = String(id)
        colorNum = colorNum.slice(-2)
        initial += '<i class="u-bg-default'+colorNum+'">'
        initial += str.slice(0,1)
        initial += '</i>'
        return initial
      }
    },

    // ------------------------------
    // 受け取ったトークデータのフォーマット化
    // ------------------------------
    talkDataFormat(talkData){
      let TALKDATA = talkData
      talkData.forEach((item, index) => {
        let dataChild = TALKDATA[index]
        dataChild.body = marked(dataChild.body)
        dataChild.is_latest = false
        if (index==0) {
          dataChild.is_latest = true
        }
        // 前回（1つ前）のデータ
        let dataChildLast = TALKDATA[index+1]
        // 1. 送信者のIDによりフィルタ
        let sender_id = dataChild.sender_id

        let sender = this.userList.filter(function(el){
          return el.id == sender_id
        })
        // 自分（利用者）のID
        let myId = this.userData.id
        dataChild.sender = sender[0]
        dataChild.avatar = sender[0].avatar_image
        dataChild.direction = "from"
        dataChild.time = moment(dataChild.sent_at).format('HH:mm')

        if (sender_id == myId) {
          dataChild.direction = "to"
        }

        // 1. 前回送信時刻からの時間経過の計算（先頭データは処理しない）
        if (dataChildLast) {
          let nowTime = moment(dataChild.sent_at)
          let lastTime = moment(dataChildLast.sent_at)
          let nowUser = dataChild.sender_id
          let lastUser = dataChildLast.sender_id
          let elapsed = (nowTime-lastTime)/60000
          // 5分以上経過、かつ送信者が同じ場合にクラス付与
          if (elapsed > 5 && nowUser == lastUser) {
            dataChild.blank = true
          }
          // 30分以上経過した場合に時刻を表示
          if (elapsed > 30) {
            dataChild.updatetime = moment(dataChild.sent_at).format('HH:mm')
          }
        }

        // 2. 日付が切り替わったときに日付を表示
        if (dataChildLast) {
          let nowDate = moment(dataChild.sent_at).format('DD')
          let lastDate = moment(dataChildLast.sent_at).format('DD')
          if (nowDate != lastDate) {
            dataChild.date = moment(dataChild.sent_at).format('YYYY/MM/DD')
          }
        } else {
          dataChild.firstdate = moment(dataChild.sent_at).format('YYYY/MM/DD')
        }
      })
      return TALKDATA
    },

    // ------------------------------
    // トークルーム表示用データ書き換え
    // ------------------------------
    filterTalk(partnerId,eventId,loader,talkId) {
      this.talkroomPage = 1
      if (loader) {
        this.talkroomLoad = true
      }
      this.talkroomErr = ""
      this.talklist.forEach((item, index) => {
        this.talklist[index].is_active = false
      })
      let targetTalkRoom

      // ▼ ▼ ▼ 退会済みユーザーの場合
      if (!partnerId) {
        targetTalkRoom = this.talklist.filter(function(el){
          return el.id == talkId
        })[0]

        this.showToast('表示できません','トークは既読になります。','6000')
        // 既読にする
        this.markRead(talkId)
        this.talkroomLoad = false
      }
      // ▲ ▲ ▲ 退会済みユーザーの場合

      // ▼ ▼ ▼ 退会済みでない場合
      if (partnerId) {
        // 読み込み中のトークアイテム
        if (eventId==false||eventId=="") {
          targetTalkRoom = this.talklist.filter(function(el){
            return el.partner.id == partnerId
          })[0]
        } else {
          targetTalkRoom = this.talklist.filter(function(el){
            return el.partner.id == partnerId
          })[0]
        }
        targetTalkRoom.is_loading = true
        targetTalkRoom.is_error = false

        axios({
          method: 'GET',
          url: BASE_URL + "/messages",
          headers: {
            Authorization: this.$cookie.get('Authorization')
          },
          params: {
            event_id: this.currentEventID,
            partner_id: partnerId,
            page: 1
          }
        })
        .then(function(response) {
          this.talkroomDefault = response.data

          // メッセージが50件だった時
          if (this.talkroomDefault.length==50) {
            // ページャー計算用の変数に次ページ（2）を格納
            this.talkroomPage = 2
          }

          // ユーザー名表示用データへ相手のニックネームを格納
          let partner = this.userList.filter(function(el){
            return el.id == partnerId
          })
          if (partner.length) {
            // 相手のデータが存在する時
            this.currentPartner = partner[0]
            this.currentPartnerID = partner[0].id
            this.currentPartner.data = {}
          } else {
            // ユーザー一覧から相手が見つからない時
            this.currentPartner = {
              "id": 0,
              "nickname": "メンバーがいません",
              "avatar_image": "/_assets/img/common/no-image-avatar.svg",
              "cover_image": "/_assets/img/common/no-image-2880-1600.png",
              "height": null,
              "age": null,
              "blood": null,
              "gender": null,
              "income": null,
              "education": null,
              "alcohol": null,
              "tobacco": null,
              "business": null,
              "birthplace": null,
              "attracted_type": null,
              "hobbies": null,
              "fashion": null,
              "prefecture": null,
              "current_place_id": null,
              "last_place_id": null,
            }
            this.currentPartnerID = 0
            this.currentPartner.data = {}
          }


          // 登録エリア外メンバーへの警告
          let targetTalkItemData = this.talklist.filter(function(el){
            return el.user_id == partnerId
          })
          if (targetTalkItemData.length&&loader==true) {
            if (targetTalkItemData[0].is_other_area==true) {
              this.showToast('注意','このメンバーはあなたの登録エリア外の会場にいます。相手があなたの登録エリアへ変更しない限り、メッセージは読まれません。','10000',true)
            }
          }

          let eventid = this.currentEventID
          this.currentPartner.data = this.alleventlist.filter(function(el){
            return el.id == eventid
          })[0]

          // 既読にする
          let currentTalk = this.talklist.filter(function(el){
            return el.user_id == partnerId
          })
          this.currentTalkID = currentTalk[0].id
          this.markRead(this.currentTalkID)
          // トークルームのスクロールを実行
          this.talkroomLoad = false
          this.pane(3)
          targetTalkRoom.is_loading = false
          targetTalkRoom.is_error = false
          targetTalkRoom.is_active = true
          hljs.initHighlightingOnLoad()
          if (loader) {
            setTimeout(() => {
              this.scrollDown()
              // ▼ これをやると位置がずれる＆iOSでキーボードが出ないので停止
              // document.querySelector('#autoHeightInput').focus()
            }, 450)
          } else {
            setTimeout(() => {
              this.scrollDown()
            }, 250)
          }
        }.bind(this))
        .catch(function(error) {
          console.error(error)
          this.talkroomLoad = false
          targetTalkRoom.is_loading = false
          targetTalkRoom.is_error = true
          targetTalkRoom.is_active = false
          this.talkroomErr = "メッセージを読み込めません"
          this.showToast('通信エラー','メッセージを読み込めませんでした。もう一度お試し下さい。','2000')
        }.bind(this))
      }
      // ▲ ▲ ▲ 退会済みでない場合

    },

    // ------------------------------
    // ユーザープロフィールのモーダル
    // ------------------------------
    modalUserDatail(userId) {
      // クリックしたアイテムのユーザーIDにより絞り込む
      let target = this.userList.filter(function(el){
        return el.id == userId
      })
      if (target.length) {
        this.userDetail = target[0]
        // ユーザープロフィールのモーダルを開く
        this.openModal('userDetail')
      } else {
        this.showToast('閲覧できません','','2000')
      }
    },


    // ------------------------------
    // 会場プロフィールのモーダル
    // ------------------------------
    modalAdminDatail(placeId) {
      // クリックしたアイテムの会場IDにより絞り込む
      this.placeDetail = this.placelist.filter(function(el){
        return el.id == placeId
      })[0]
      // 会場プロフィールのモーダルを開く
      this.openModal('adminDetail')
    },

    // ------------------------------
    // トークルームのスクロール（コンポーネント外用）
    // ------------------------------
    scrollDown() {
      const target = document.querySelector('.p-scrollable--talk')
      setTimeout(() => {
        const height = target.scrollHeight - target.offsetHeight
        target.scrollTop = height
      }, 10);
    },

    // ------------------------------
    // 会場の詳細をアクティブ化する
    // ------------------------------
    placeDetailActive(placeId) {
      // ペインのアニメーション
      // カレントID1に "placedetail" を設定
      this.currentId1 = this.pane1[2].id

      // クリックした会場のID
      this.placeDetail = this.placelist.filter(function(el){
        return el.id == placeId
      })[0]
    },

    // ------------------------------
    // 終了までの残り時間
    // ------------------------------
    getDuration(endTime) {
      // diffメソッドを使って、現在時刻と終了時刻の日時の差を、ミリ秒で取得
      let diff = moment(endTime).diff(moment())
      // diffの時間の差分を返す
      if (diff < 0) {
        diff = 0
      }
      return moment.duration(diff)
    },

    // ------------------------------
    // 終了までの残り時間の出力フォーマット化
    // ------------------------------
    formatRemain(duration) {
      // getDurationで取得したduration（時間の差分）から、日・時・分・秒を取得
      const days = Math.floor( duration.asDays())
      // ※ 日数は出力しない代わりに、日数✕24時間を足して出力する
      let hours = duration.hours() + days*24
      hours = ('0' + hours).slice(-2)
      const minutes = ('0' + duration.minutes()).slice(-2)
      const seconds = ('0' + duration.seconds()).slice(-2)

      // 出力フォーマット化して返す
      // return `${hours}時間${minutes}分${seconds}秒`
      // return duration
      if (duration>0) {
        return `${hours}時間${minutes}分${seconds}秒`
      } else {
        return '終了したイベント'
      }

    },

    // ------------------------------
    // モーダルの開閉
    // オプションにターゲットを入れて渡す
    // ------------------------------
    openModal(target) {
      this.modal[target] = true
    },

    closeModal(target) {
      this.modal[target] = false
    },

    // ------------------------------
    // ペインのスライド処理
    // ------------------------------
    pane(e,time) {
      const pane = $('.l-pane')
      let targetElm, pushedNum, pushedElm
      let targetVal = Number(e)
      if (time == "") {
        time = 0
      }
      if (targetVal) {
        setTimeout(() => {
          targetElm = '#pane' + targetVal
          pushedNum = targetVal + 1
          pushedElm = '#pane' + pushedNum
          pane.removeClass('is-visible')
          $(pushedElm).addClass('is-pushed')
          $(targetElm).addClass('is-visible').removeClass('is-pushed')
        }, time);
      }
    },

    // ------------------------------
    // チェックイン処理
    // ------------------------------
    checkIn() {
      // targetEvent には前回にクリックしているイベントリストアイテムの
      // イベントIDが入っている。
      let targetEvent = this.checkinTargetEvent
      // そのイベントIDにより、イベントリストを絞り込む
      this.noweventlistTmp = this.noweventlist.filter(function(el){
        return el.id == targetEvent
      })

      // ------------------------------
      // ターゲットのイベントのデータの
      // チェックインコードが入力値と合っているか判別
      // ------------------------------
      // エラーの処理
      // （データの checkinErr の各オプションを更新）
      // ------------------------------
      let code = false, place = false, fashion = false

      // 1. コードが入力されているか判別
      if (this.checkincode=="") {
        this.checkinErr.code = true
        code = true
      } else {
        this.checkinErr.code = false
        code = false
      }

      // 2. 会場が選択されているか判別
      if (this.nowPlaceID=="") {
        this.checkinErr.place = true
        place = true
      } else {
        this.checkinErr.place = false
        place = false
      }

      // 3. ファッションが入力されているか判別
      if (this.userData.fashion=="") {
        this.checkinErr.fashion = true
        fashion = true
      } else {
        this.checkinErr.fashion = false
        fashion = false
      }

      if (code||place||fashion) {
        // どれかがエラーのとき
        console.log('入力エラー')
      } else {
        // ------------------------------
        // 全て正常に入力・選択されているとき
        // ------------------------------
        // 1. イベントへのチェックイン
        // ------------------------------
        this.checkinLoad = true
        // 大文字に変換
        this.checkincode = this.checkincode.toUpperCase()
        this.checkinErr.placeErr = false

        this.messageChannel.perform('checkin_event', {
          event_id: targetEvent,
          code: this.checkincode,
          place_id: this.nowPlaceID,
          token: this.$cookie.get('Authorization')
        });
      }
    },

    // ------------------------------
    // 仮登録を行う
    // ------------------------------
    registerProvisionalUser() {
      this.regTmp.msg = ''
      this.regTmp.debug = ''

      // ▼ ▼ ▼ 入力したメアド・PW・PD確認の内容
      let email = this.userLogIn.email
      let pass1 = this.userLogIn.password
      let pass2 = this.userLogIn.password_conf
      // ▲ ▲ ▲ 入力したメアド・PW・PD確認の内容

      // ▼ ▼ ▼ メアドとPWの形式の確認
      let mailConf = this.regexp.test(email)
      let passConf = this.pwReg.test(pass1)
      let passMatch = pass1==pass2
      // ▲ ▲ ▲ メアドとPWの形式の確認

      // ▼ ▼ ▼ 入力内容とエラーメッセージ
      // 1. Eメールアドレス
      if (email=='') {
        // メアドが入力されていない時
        this.regTmp.msg += 'Eメールアドレスが未入力です。'
      } else if (mailConf==false) {
        // メアドの形式が違う時
        this.regTmp.msg += 'Eメールアドレスの形式に誤りがあります。'
      }
      // 2. パスワード
      if (pass1=='') {
        // パスワードが入力されていない時
        this.regTmp.msg += 'パスワードが未入力です。'
      } else if (pass2=='') {
        // 確認用パスワードが入力されていない時
        this.regTmp.msg += '確認用パスワードが未入力です。'
      } else if (passConf==false) {
        // パスワードの形式が違う時
        this.regTmp.msg += 'パスワードは半角英字と数字を織り交ぜ、8文字以上のものを指定してください。'
      } else if (passMatch==false) {
        // パスワードと確認用パスワードが一致しない時
        this.regTmp.msg += '確認用のパスワードが一致しません。'
      }
      // ▲ ▲ ▲ 入力内容とエラーメッセージ

      if (mailConf&&passConf&&passMatch) {
        // ▼ ▼ ▼ すべて入力済み、かつ入力形式が正しい場合
        this.userLogInLoad = true
        axios({
          method: 'POST',
          url: BASE_URL + '/registrations',
          data: {
            email: this.userLogIn.email,
            password: this.userLogIn.password,
            password_confirmation: this.userLogIn.password_conf
          }
        })
        .then(function(response) {
          // ログインしたユーザーのデータを取得
          this.setUserData(response)
          this.userLogInLoad = false
          this.regTmp.msg = ''
          this.regTmp.debug = ''
        }.bind(this))
        .catch(function(error) {
          this.userLogInLoad = false
          this.regTmp.msg = error.response.data.error.message
          this.regTmp.debug = error.message
        }.bind(this))
        // ▲ ▲ ▲ すべて入力済み、かつ入力形式が正しい場合
      } else {
        this.userLogInLoad = false
        this.regTmp.debug = 'Input Err : User entry wrong'
      }
    },

    // ------------------------------
    // ユーザー情報の更新を行う
    // ------------------------------
    registerUser() {
      this.userLogInLoad = true
      this.loginForm.msg = ""
      this.loginForm.debug = ""
      let data = new FormData();
      Object.keys(this.newReg).forEach(key => {
        data.append(key, this.newReg[key])
      });

      if (this.newReg.place_id>0) {
        this.placeSetting(this.newReg.place_id)
      }

      axios({
        method: 'PUT',
        url: BASE_URL + '/users',
        data,
        headers: {
          Authorization: this.$cookie.get('Authorization')
        }
      })
      .then(function() {
        location.href = '/user'
        this.userLogInLoad = false
        this.loginForm.msg = ""
        this.loginForm.debug = ""
      }.bind(this))
      .catch(function(error) {
        alert(error.response.data.error.message);
        this.userLogInLoad = false
        if (error.response.data.error.message==undefined) {
          this.loginForm.msg = 'Cookie から仮登録ユーザーの情報が取得できませんでした。Cookieを有効にし、もう一度お試し下さい。'
        } else {
          this.loginForm.msg = error.response.data.error.message
        }
      }.bind(this))
    },

    // ------------------------------
    // Eメールアドレスとパスワードを入力してログイン
    // ログイン情報入力してボタン押してからの一連の処理
    // ------------------------------
    sessionUser() {
      // ------------------------------
      // 1. ログインユーザー
      // ------------------------------
      // this.userLogIn.email = "test1@example.com"
      // this.userLogIn.password = "password"
      let email = this.userLogIn.email
      let password = this.userLogIn.password
      this.userLogInLoad = true
      this.loginForm.msg = ""
      this.loginForm.debug = ""

      // 入力内容のバリデーション用
      let mailConf = this.regexp.test(email)
      let passConf = this.pwReg.test(password)
      // ▼ ▼ ▼ デバッグ時、半角でも通るように（あとで消す）
      let hankaku = /^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/
      let hankakuTest = hankaku.test(password)
      if (hankakuTest==false||password.length<8) {
        passConf = false
      } else {
        passConf = true
      }
      // ▲ ▲ ▲ デバッグ時、半角でも通るように（あとで消す）
      let EMPTY = [], WRONG = []

      if (mailConf==false) {
        this.userLogInLoad = false
        if (email=="") {
          EMPTY.push('Eメールアドレス')
        } else {
          WRONG.push('Eメールアドレス')
        }
      }

      if (passConf==false) {
        this.userLogInLoad = false
        if (password=="") {
          EMPTY.push('パスワード')
        } else {
          WRONG.push('パスワード')
        }
      }

      let EMPTYMSG = ''
      for(let i = 0; i < EMPTY.length; i++) {
        if (i==0) {
          EMPTYMSG += EMPTY[i]
        } else {
          EMPTYMSG += '・' + EMPTY[i]
        }
      }
      if (EMPTYMSG!='') {
        EMPTYMSG += 'が未入力です。'
      }
      let WRONGMSG = ''
      for(let i = 0; i < WRONG.length; i++) {
        if (i==0) {
          WRONGMSG += WRONG[i]
        } else {
          WRONGMSG += '・' + WRONG[i]
        }
      }
      if (WRONGMSG!='') {
        WRONGMSG += 'の形式に誤りがあります。'
      }
      this.loginForm.msg = EMPTYMSG + WRONGMSG
      this.loginForm.debug = "Input Err : User entry wrong"

      // if (mailConf==true && passConf==true) {
      if (mailConf==true && passConf==true) {
        this.prossessData.show = true
        axios({
          method: 'POST',
          url: BASE_URL + '/sessions',
          data: {
            email: email,
            password: password
          }
        })
        .then(function(response) {
          // ログインしたユーザーのデータを取得
          this.setUserData(response)
        }.bind(this))
        .catch(function(error) {
          console.log(error)
          this.userLogInLoad = false
          this.loginForm.msg = error.response.data.error.message;
          this.loginForm.debug = "API POST Err : sessions"
          this.prossessData.show = false
        }.bind(this))
      }
    },

    // ------------------------------
    // ログアウトを行う
    // ------------------------------
    logoutUser() {
      const result = confirm('ログアウトしますか？');

      if (result) {
        axios({
          method: 'DELETE',
          url: BASE_URL + '/sessions',
          data: {
            Authorization: this.$cookie.get('Authorization')
          }
        })
        .then(function() {
          this.userData = null
          this.$cookie.delete('Authorization')
          location.href = '/user/'
        }.bind(this))
        .catch(function() {
          this.userData = null
          this.$cookie.delete('Authorization')
          location.href = '/user/'
        }.bind(this))
      }
    },

    // ------------------------------
    // 確認メールを再送信する
    // ------------------------------
    resendConfirmationMail() {
      axios({
        method: 'POST',
        url: BASE_URL + '/users/confirmation_resend',
        headers: {
          Authorization: this.$cookie.get('Authorization')
        }
      })
      .then(function() {
        alert('確認メールを再送信しました');
      }.bind(this))
      .catch(function(error) {
        alert(error.response.data.error.message);
      }.bind(this))
    },

    // ------------------------------
    // パスワード再設定の要求を行う
    // ------------------------------
    requestResetPassword() {
      let email = this.userLogIn.email
      axios({
        method: 'POST',
        url: BASE_URL + '/passwords',
        data: {
          email: email
        }
      })
      .then(function() {
        alert('パスワード再設定用のメールを送信しました。')
        this.forgotPasswordCancel()
      }.bind(this))
      .catch(function() {
        this.userLogInLoad = false
        this.loginForm.msg = "エラーが発生しました。もう一度お試し下さい。"
        this.loginForm.debug = "API POST Err : passwords"
        this.prossessData.show = false
      }.bind(this))
    },

    // ------------------------------
    // パスワードを更新する
    // ------------------------------
    requestUpdatePassword() {
      let password = this.userLogIn.password
      let password_confirmation = this.userLogIn.password_conf
      // URLパラメータ取得
      let query = _.chain(window.location.search)
        .replace('?', '')
        .split('&')
        .map(_.partial(_.split, _, '=', 2))
        .fromPairs()
        .value();

      axios({
        method: 'PUT',
        url: BASE_URL + '/passwords',
        data: {
          password: password,
          password_confirmation: password_confirmation,
          reset_password_token: query.reset_password_token.toString(),
        }
      })
      .then(function() {
        alert('パスワードが更新されました。ログインしてください。')
        location.href = '/user/'
      }.bind(this))
      .catch(function() {
        this.userLogInLoad = false
        this.loginForm.msg = "エラーが発生しました。もう一度お試し下さい。"
        this.loginForm.debug = "API POST Err : passwords"
        this.prossessData.show = false
      }.bind(this))
    },

    eventListUpdate() {
      // ------------------------------
      // 2.1. 現在のイベント
      // ------------------------------
      // 進行状況の配列を空にする
      this.prossessData.item.splice(0, this.prossessData.item.length-2)
      let status = {
        'id': 3,
        'title': 'イベント情報の取得',
        'content': '現在開催中のイベント情報を取得しています',
        'error': false,
        'completed': false,
        'log': '',
      }
      this.prossessData.item.unshift(status)
      axios({
        method: 'GET',
        url: BASE_URL + '/events',
        headers: {
          Authorization: this.$cookie.get('Authorization')
        }
      })
      .then(function(response) {
        // 現在開催中イベント表示用データを更新
        let EVENTLIST = response.data
        EVENTLIST.forEach((item, index) => {
          EVENTLIST[index].remain = ""
          EVENTLIST[index].rem_view = ""
          EVENTLIST[index].past = false
          EVENTLIST[index].disable = false
        })
        this.noweventlist = EVENTLIST
        // 会場表示用データを更新
        status.content = '現在開催中のイベント情報を取得しました'
        status.error = false
        status.completed = true
        this.placeList()
      }.bind(this))
      .catch(function(error) {
        console.error(error)
        this.userLogInLoad = false
        this.loginForm.msg = "エラーが発生しました。もう一度お試し下さい。"
        this.loginForm.debug = "API GET Err : events"

        status.content = '現在開催中のイベント情報の取得に失敗しました'
        status.error = true
        status.completed = false
        status.log = error
      }.bind(this))
    },

    pastEventList() {
      // ------------------------------
      // 2.2. 過去のイベント
      // ------------------------------
      // 進行状況の配列を空にする
      this.prossessData.item.splice(0, this.prossessData.item.length-5)
      let status = {
        'id': 6,
        'title': '非アクティブイベントのデータの取得',
        'content': '非アクティブイベントのデータを取得しています',
        'error': false,
        'completed': false,
        'log': '',
      }
      this.prossessData.item.unshift(status)
      axios({
        method: 'GET',
        url: BASE_URL + '/events/past',
        headers: {
          Authorization: this.$cookie.get('Authorization')
        }
      })
      .then(function(response) {
        // 現在開催中イベント表示用データを更新
        let EVENTLIST = response.data
        EVENTLIST.forEach((item, index) => {
          EVENTLIST[index].remain = ""
          EVENTLIST[index].rem_view = ""
          EVENTLIST[index].past = true
          EVENTLIST[index].disable = false
        })
        this.pasteventlist = EVENTLIST
        // 現在・過去のイベントの配列をつなげる
        let ALLEVENT = EVENTLIST.concat(this.noweventlist)
        this.alleventlist = ALLEVENT
        this.defaultData()
        status.content = '非アクティブイベントのデータを取得しました'
        status.error = false
        status.completed = true
      }.bind(this))
      .catch(function(error) {
        console.error(error)
        this.userLogInLoad = false
        this.loginForm.msg = "エラーが発生しました。もう一度お試し下さい。"
        this.loginForm.debug = "API GET Err : events/past"
        status.content = '非アクティブイベントのデータの取得に失敗しました'
        status.error = true
        status.completed = false
        status.log = error
      }.bind(this))
    },

    placeList() {
      // ------------------------------
      // 会場一覧表示用データ取得
      // ------------------------------
      // 進行状況の配列を空にする
      this.prossessData.item.splice(0, this.prossessData.item.length-4)
      let status = {
        'id': 5,
        'title': '会場データの取得',
        'content': '会場データを取得しています',
        'error': false,
        'completed': false,
        'log': '',
      }
      this.prossessData.item.unshift(status)
      this.loadErr.show = false
      if (this.userData.area_id>0) {
        // ------------------------------
        // エリアが登録されている時だけ、
        // 会場一覧の取得が処理されるようにする
        // ------------------------------
        axios({
          method: 'GET',
          url: BASE_URL + '/places',
          headers: {
            Authorization: this.$cookie.get('Authorization')
          },
          params: {
            area_id: this.userData.area_id,
          },
        })
        .then(function(response) {
          // 会場表示用データを更新
          this.placelist = response.data
          this.placelistTmp = _.clone(this.placelist)
          this.pastEventList()
          this.loaded = true
          this.loadErr = {
            show: false,
            title: "",
            content: "",
          }
          status.content = '会場データを取得しました'
          status.error = false
          status.completed = true
        }.bind(this))
        .catch(function(error) {
          console.error(error)
          this.userLogInLoad = false
          this.loginForm.msg = "エラーが発生しました。もう一度お試し下さい。"
          this.loginForm.debug = "API GET Err : users/places"

          let errCont = ''
          errCont += '<b>response : </b>'
          errCont += error.response.status
          errCont += ' '
          errCont += error.response.statusText
          errCont += '<br>'
          errCont += '<b>config : </b>'
          errCont += error.config.method
          errCont += ' '
          errCont += error.config.url
          errCont += '<br>'

          this.loadErr = {
            show: true,
            title: "API GET Error",
            content: errCont,
          }
          status.content = '会場データの取得に失敗しました'
          status.error = true
          status.completed = false
          status.log = error
        }.bind(this))
      } else {
        // ------------------------------
        // エリアを登録してないユーザーの場合
        // ------------------------------
        this.pastEventList()
        this.loaded = true
        this.loadErr = {
          show: false,
          title: "",
          content: "",
        }
        status.content = 'エリアが未登録のため会場は取得しません'
        status.error = false
        status.completed = true
      }
    },

    // ------------------------------
    // トーク一覧のデータを取得
    // ------------------------------
    createTalks(index,item,TALKLISTDATA,statusCount) {
      let status = {
        'id': 7+statusCount,
        'title': 'イベントID:'+item.id+'のトーク一覧のデータの取得',
        'content': 'イベントID:'+item.id+'のトーク一覧のデータを取得しています',
        'error': false,
        'completed': false,
        'log': '',
      }
      this.prossessData.item.unshift(status)
      let eventid = item.id
      let URL = BASE_URL + "/events/"+eventid+"/talks"
      axios({
        method: 'GET',
        url: URL,
        headers: {
          Authorization: this.$cookie.get('Authorization')
        }
      })
      .then(function(response) {
        // 対象のイベントに紐づくトークリストを取得
        this.talklistData[index] = {}
        this.talklistData[index].event_id = eventid
        this.talklistData[index].data = response.data

        // 未読数の合計
        let unread = 0
        this.talklistData[index].data.forEach((item, index_) => {
          unread = unread + this.talklistData[index].data[index_].unread_count
        })
        item.unread_count = unread
        status.content = 'イベントID:'+item.id+'のトーク一覧のデータを取得しました'
        status.error = false
        status.completed = true
        this.talkCompletedCount += 1
        // ユーザー一覧のデータを取得（API）
        this.getUsers(index,item,this.talklistData,statusCount)
      }.bind(this))
      .catch(function(error) {
        console.error(error)
        this.userLogInLoad = false
        this.loginForm.msg = "エラーが発生しました。もう一度お試し下さい。"
        this.loginForm.debugDefault += "events/:"+eventid+"/talks, "
        status.content = 'イベントID:'+item.id+'のトーク一覧のデータの取得に失敗しました'
        status.error = true
        status.completed = false
        status.log = error
        this.unreadCount()
      }.bind(this))
    },

    // ------------------------------
    // ユーザー一覧のデータを取得
    // ------------------------------
    getUsers(index,item,TALKLISTDATA,statusCount) {
      let status_ = {
        'id': 7+this.alleventlist.length+statusCount,
        'title': 'イベントID:'+item.id+'のユーザー一覧のデータの取得',
        'content': 'イベントID:'+item.id+'のユーザー一覧のデータを取得しています',
        'error': false,
        'completed': false,
        'log': '',
      }
      this.prossessData.item.unshift(status_)
      let eventid = item.id
      // statusCount++
      let userListUrl = BASE_URL + "/events/"+eventid+"/users"
      axios({
        method: 'GET',
        url: userListUrl,
        headers: {
          Authorization: this.$cookie.get('Authorization')
        }
      })
      .then(function(response) {
        let responseData = response.data
        // ▼ ▼ ▼ ユーザーデータから重複をはじいて再代入する
        // 1. まずはID順にソート
        responseData.sort(function(before,after) {
          if(before.id<after.id) return -1
          if(before.id > after.id) return 1
          return 0
        })
        // 2. 次に重複チェックOKなものだけ配列にPush
        let duplicateCheckedData = []
        responseData.forEach((item, index) => {
          if (index==0) {
            // 配列の先頭の場合
            duplicateCheckedData.push(responseData[index])
          } else {
            // 配列の先頭ではない場合（一個前と比べる）
            let thisId = responseData[index].id
            let prevId = responseData[index-1].id
            if (thisId!=prevId) {
              // 対象のオブジェクトと一個前のそれが同じじゃなければ
              duplicateCheckedData.push(responseData[index])
            }
          }
        })
        // 3. 重複をはじいたデータを再代入
        responseData = duplicateCheckedData
        // ▲ ▲ ▲ ユーザーデータから重複をはじいて再代入する

        // ------------------------------
        // ユーザー一覧
        // ------------------------------
        this.userListDefault[index] = {}
        this.userListDefault[index].event_id = eventid
        // 取得したデータをindexのdataにぶっ込む
        this.userListDefault[index].data = responseData

        // ------------------------------
        // トーク一覧
        // ------------------------------
        this.talklistTmp[index] = {}
        this.talklistTmp[index].event_id = eventid
        this.talklistTmp[index].data = {}
        this.talklistTmp[index].data.partner = responseData

        this.talklistTmp[index].data.partner.forEach((item, index_) => {
          this.talklistTmp[index].data.partner[index_].current_place_name = '会場未設定または見つかりません'
          let placeID = this.talklistTmp[index].data.partner[index_].current_place_id
          let areaID = this.talklistTmp[index].data.partner[index_].area_id
          let prefVal = this.talklistTmp[index].data.partner[index_].prefecture
          let placeData, areaData, prefData

          if (placeID!=null) {
            // placeIDが存在する時
            // 1. 会場一覧から相手の会場IDを探す
            placeData = this.placelist.filter(function(el){
              return el.id == placeID
            })
            // 2. エリア一覧から相手のエリアの値を探す
            areaData = this.areaList.filter(function(el){
              return el.id == areaID
            })
            // 3. 都道府県一覧から相手の都道府県の値を探す
            prefData = this.prefecture.filter(function(el){
              return el.value == prefVal
            })
            if (placeData.length>0) {
              // 相手の会場IDが、会場一覧にある場合
              this.talklistTmp[index].data.partner[index_].current_place_name = placeData[0].name
            } else if(areaData.length>0) {
              // 相手のエリアIDが、エリア一覧にある場合
              this.talklistTmp[index].data.partner[index_].current_place_name = areaData[0].name + '内の会場'
            } else if(prefData.length>0) {
              // 相手の都道府県の値が都道府県一覧にある場合
              this.talklistTmp[index].data.partner[index_].current_place_name = prefData[0].title + '内のエリア'
            } else {
              this.talklistTmp[index].data.partner[index_].current_place_name = '登録エリア外の会場'
            }
            this.unreadCount()
          }
        })

        status_.content = 'イベントID:'+item.id+'のユーザー一覧のデータを取得しました'
        status_.error = false
        status_.completed = true
        this.userCompletedCount +=1
        this.closeModal('userLogIn')

        // ▼ ▼ ▼ トークルームを表示中に処理が走った場合の既読の対応
        // 表示しているトークルームの相手のID
        let currentPartnerID = this.currentPartnerID
        // 現在アクティブなイベントのID
        let currentEventID = this.currentEventID
        if (currentPartnerID>0&&currentEventID==eventid) {
          let displayTalkData = this.talklistData[index].data.filter(function(el){
            return el.partner.id == currentPartnerID
          })
          if (displayTalkData.length) {
            // 相手のIDで絞り込んだデータが存在する時
            let displayTalk = displayTalkData[0]
            // 1. フロントのデータを既読にする
            displayTalk.unread_count = 0
            // 2. トークリストをバックグラウンドで更新する
            this.talkListUpdate(eventid,false)
            // 3. 既読のAPIを走らせる
            this.markRead(displayTalk.id)
          }

        } else if(currentPartnerID>0) {
          // トークルーム閲覧していない、または別のイベントの場合
          // this.talkListUpdate(eventid,false)
        }
        // ▲ ▲ ▲ トークルームを表示中に処理が走った場合の既読の対応



      }.bind(this))
      .catch(function(error) {
        console.error(error)
        this.userLogInLoad = false
        this.loginForm.msg = "エラーが発生しました。もう一度お試し下さい。"
        this.loginForm.debugDefault += "events/:"+eventid+"/users, "
        status_.content = 'イベントID:'+item.id+'のユーザー一覧のデータの取得に失敗しました'
        status_.error = true
        status_.completed = false
        status_.log = error
      }.bind(this))
    },

    // ------------------------------
    // 3. ユーザー一覧・トーク一覧
    // ------------------------------
    defaultData() {
      // 進行状況の配列を空にする
      this.prossessData.item.splice(0, this.prossessData.item.length-6)

      this.loginForm.debug = ""
      this.loginForm.debugDefault = "API GET Err :"
      this.completedCount = 0
      this.userCompletedCount = 0
      this.talkCompletedCount = 0
      // ↓ 各イベントごとにトーク一覧APIが実行されて入る
      let TALKLISTDATA = []
      // ↑ ※ 最終的に this.talklistData に入る

      if (this.alleventlist.length==0) {
        this.closeModal('userLogIn')
      }

      let statusCount = 0
      if (this.alleventlist.length) {
        this.talkDataCreate = 'starting'
        let allEventCount = this.alleventlist.length
        this.alleventlist.forEach((item, index) => {
          // トーク一覧のデータを取得（API）
          this.createTalks(index,item,TALKLISTDATA,statusCount)
          statusCount ++
        })
      } else {
        this.talkDataCreate = 'finished'
      }
      this.setAreaName()
    },

    talkListUpdate(eventid,pane) {
      // ------------------------------
      // 4. ユーザーリスト・トークリスト
      // ------------------------------
      // 4.1. currentUserList : トーク一覧に入れるためのユーザー一覧
      // ------------------------------
      let currentUserList = []
      this.currentEventID = eventid
      let currentUserListDefault = this.talklistTmp.filter(function(el){
        return el.event_id == eventid
      })
      // // ▼ ▼ ▼ プロフィールモーダルのためのデータ格納
      // this.userList = currentUserListDefault[0].data.partner
      // // ▲ ▲ ▲ プロフィールモーダルのためのデータ格納
      currentUserListDefault[0].data.partner.forEach((item, index) => {
        currentUserList[index] = {}
        currentUserList[index].partner = currentUserListDefault[0].data.partner[index]
      })

      // 4.2. currentTalkList : トーク一覧表示データのもとになる
      // 最終的に this.talklist に入る（チェックインしてる場合のみ）
      // ------------------------------
      let currentTalkList = []
      let currentTalkListDefault = this.talklistData.filter(function(el){
        return el.event_id == eventid
      })
      currentTalkList = currentTalkListDefault[0].data

      currentUserList.forEach((item, index) => {
        let partnerId = currentUserList[index].partner.id
        currentUserList[index].user_id = partnerId

        // トークリストごと、各データのユーザーIDで絞り込み
        let TARGETTALK = currentTalkList.filter(function(el){
          // -----------------------【修正箇所】
          if (el.partner!=null) {
            return el.partner.id == partnerId
          }
          // -----------------------【修正箇所】
        })

        // トークリストに対象のユーザーのトークがあるときは、
        // partnerオブジェクトを更新
        // ------------------------------
        if (TARGETTALK.length) {
          currentUserList[index].id = TARGETTALK[0].id
          currentUserList[index].last_message = TARGETTALK[0].last_message
          currentUserList[index].unread_count = TARGETTALK[0].unread_count
        } else {
          currentUserList[index].id = ""
          currentUserList[index].last_message = {
            body: "",
            id: "",
            image: "",
            sent_at: ""
          }
          currentUserList[index].unread_count = 0
        }

        // 会場を移動したユーザーの処理
        // ------------------------------
        currentUserList[index].last_place_name = ""
        let currentPlaceId = currentUserList[index].partner.current_place_id
        let lastPlaceId = currentUserList[index].partner.last_place_id

        if (lastPlaceId) {
          currentUserList[index].is_moved = true
          // プルダウンで表示されている会場と、移動先が同じ場合
          if (currentPlaceId==this.currentPlaceID) {
            currentUserList[index].is_moved = false
          }

          let lastPlaceName = '会場ID:'+ lastPlaceId
          let lastPlace = this.placelist.filter(function(el){
            return el.id == lastPlaceId
          })
          if (lastPlace.length) {
            lastPlaceName = lastPlace[0].name
          } else {
            lastPlaceName = 'エリア外（会場ID:'+ lastPlaceId+'）'
          }
          currentUserList[index].last_place_name = lastPlaceName
        }

        // エリア外かどうかの処理
        // ------------------------------
        let currentPlace = this.placelist.filter(function(el){
          return el.id == currentPlaceId
        })
        if (currentPlace.length==0) {
          currentUserList[index].is_other_area = true
        }
      })

      // ------------------------------
      // ▼ ▼ ▼ 退会ユーザーの処理
      let LEAVEUSERTALK = currentTalkList.filter(function(el){
        return el.partner == null
      })
      LEAVEUSERTALK.forEach((item, index) => {
        item.partner = {
          "id": 0,
          "nickname": "メンバーがいません",
          "avatar_image": "/_assets/img/common/no-image-avatar.svg",
          "cover_image": "/_assets/img/common/no-image-2880-1600.png",
          "height": null,
          "age": null,
          "blood": null,
          "gender": null,
          "income": null,
          "education": null,
          "alcohol": null,
          "tobacco": null,
          "business": null,
          "birthplace": null,
          "attracted_type": null,
          "hobbies": null,
          "fashion": null,
          "prefecture": null,
          "current_place_id": null,
          "last_place_id": null,
        }
        item.is_loading = false
        currentUserList.unshift(item)
      })
      // ▲ ▲ ▲ 退会ユーザーの処理
      // ------------------------------

      let targetEvent = this.alleventlist.filter(function(el){
        return el.id == eventid
      })

      if (targetEvent[0].disable==true) {
        // ------------------------------
        // 閲覧可能時間を過ぎている場合
        // ------------------------------
        this.showToast('閲覧できません','このイベントのトークを閲覧できる時間が過ぎているため、閲覧できません','2000')
      } else if (targetEvent[0].is_checked_in==true) {
        // ------------------------------
        // チェックインしているイベントの場合
        // ------------------------------

        // ▼ ▼ ▼ トークルーム表示用データのリセット
        if (pane!=false) {
          this.currentPartner = ""
          this.currentPartnerID = ""
          this.currentTalkID = ""
          this.talkroomDefault = []
          this.talkroomPage = 1
        }
        // ▲ ▲ ▲ トークルーム表示用データのリセット

        this.talklistAll = currentUserList

        // ▼ ▼ ▼ CURRENTEVENT（主にトークリストのヘッダー）
        let CURRENTEVENT = this.alleventlist.filter(function(el){
          return el.id == eventid
        })
        // console.log(CURRENTEVENT)
        this.currentEvent = CURRENTEVENT[0]
        // ▲ ▲ ▲ CURRENTEVENT（主にトークリストのヘッダー）

        // // 現在チェックイン中の会場があるときは絞り込む
        // let currentPlaceID = this.currentPlaceID
        // if (currentPlaceID=="") {
        //   this.talklist = this.talklistAll
        // } else {
        //   this.talklist = this.talklistAll.filter(function(el){
        //     return el.partner.current_place == currentPlaceID
        //   })
        // }
        this.talklist = this.talklistAll

        if (targetEvent[0].past==true) {
          this.showToast('閲覧のみ','このイベントは終了しているため、メッセージの送信はできません','3000')
        }
        if (pane!=false) {
          if (pane==null) {
            this.pane(2,0)
          } else {
            this.pane(pane,0)
          }
        }

        // ▼ ▼ ▼ プロフィールモーダルのためのデータ格納
        this.userList = currentUserListDefault[0].data.partner
        // ▲ ▲ ▲ プロフィールモーダルのためのデータ格納

        // 自分のデータ
        let myId = this.userData.id
        let myData = this.userList.filter(function(el){
          return el.id == myId
        })[0].is_own = true
        this.placeUnreadByEvent()
      } else {
        // ------------------------------
        // チェックインしていないとき
        // ------------------------------
        // クリックしたアイテムのイベントIDをチェックイン対象にわたす
        this.checkinTargetEvent = eventid
        // チェックイン用モーダルを開く
        this.openModal('checkIn')
      }
    },

    // ------------------------------
    // トースト表示
    // ------------------------------
    showToast(title,lead,time,accept) {
      this.toast.show = true
      this.toast.title = title
      this.toast.lead = lead
      this.toast.accept = accept

      setTimeout(() => {
        this.toast.show = false
        this.toast.accept = false
      }, time);
    },

    // ------------------------------
    // 通知表示
    // ------------------------------
    showNotice(title,lead,time) {
      this.notice.show = true
      this.notice.title = title
      this.notice.lead = lead

      if (time) {
        setTimeout(() => {
          this.notice.show = false
        }, time);
      } else {
        setTimeout(() => {
          this.notice.show = false
        }, 10000);
      }
    },

    // ------------------------------
    // リアルタイムメッセージ表示
    // ------------------------------
    showReceive(content,time) {
      this.receive.show = true
      this.receive.id = content.id
      this.receive.event_id = content.event_id
      this.receive.label = content.label
      this.receive.avatar_image = content.avatar_image
      this.receive.nickname = content.nickname
      this.receive.age = content.age
      this.receive.gender = content.gender
      this.receive.blood = content.blood
      this.receive.body = content.body
      this.receive.annotation = content.annotation

      if (time) {
        setTimeout(() => {
          this.receive.show = false
        }, time);
      } else {
        setTimeout(() => {
          this.receive.show = false
        }, 10000);
      }
    },

    unreadCount() {
      // ------------------------------
      // 1. 会場ごとの未読の合計
      // ------------------------------
      let myId = this.userData.id
      this.talklistData.forEach((item, index) => {
        let target = this.talklistData[index].data.filter(function(el){
          // -----------------------【修正箇所】
          if (el.partner!=null) {
            return el.partner.id == myId
          }
          // -----------------------【修正箇所】
        })
        if (target.length) {
          let place = target[0].partner.current_place_id
        }
      })

      if (this.placelist) {
        this.placelist.forEach((item, index) => {

          let place_unread_count = 0
          let placeId = ""
          if (this.placelist[index]) {
            placeId = this.placelist[index].id
          }

          if (this.talklistData) {
            this.talklistData.forEach((item_, index_) => {
              let targetData = this.talklistData[index_].data.filter(function(el){
                // -----------------------【修正箇所】
                if (el.partner!=null) {
                  return el.partner.current_place_id == placeId
                }
                // -----------------------【修正箇所】
              })
              if (targetData.length) {
                targetData.forEach((item__, index__) => {
                  place_unread_count += targetData[index__].unread_count
                })
              }
            })
            this.placelist[index].unread_count = place_unread_count
          }

        })
      }

      // ------------------------------
      // 2. イベント一覧の未読合計の更新
      // ------------------------------
      if (this.talklistData.length>0) {
        this.alleventlist.forEach((item, index) => {
          let targetEventId = this.alleventlist[index].id
          let targetTalk = this.talklistData.filter(function(el){
            return el.event_id == targetEventId
          })[0].data

          let count = 0
          targetTalk.forEach((item, index) => {
            count += targetTalk[index].unread_count
          })
          this.alleventlist[index].unread_count = count
        })
      }

    },

    // ------------------------------
    // 通知消す
    // ------------------------------
    hideNotice() {
      this.notice.show = false
    },

    // ------------------------------
    // トースト消す
    // ------------------------------
    hideToast() {
      this.toast.show = false
    },

    // ------------------------------
    // 通知消す
    // ------------------------------
    hideReceive() {
      this.receive.show = false
    },

    // ------------------------------
    // プロフィールの更新
    // ------------------------------
    updateProfile() {
      this.toast.show = false
      let data = new FormData();
      let USERDATA = this.userData
      let PROFILE = this.userDataTemporary
      let dataCount = 0
      Object.keys(PROFILE).forEach((key,index) => {
        if (PROFILE[key]=='avatar_image'&&this.avatar_image_preview=="") {
          PROFILE[key] = ""
        } else {
          if (USERDATA[key]!=PROFILE[key]) {
            data.append(key, PROFILE[key])
            dataCount++
          }
        }
      })
      if (dataCount>0) {
        // const updateNotice = setTimeout(() => {
        //   this.toast = {
        //     show: true,
        //     title: "プロフィールデータ送信中",
        //     lead: "通信に時間がかかっています。しばらくお待ち下さい。",
        //   }
        // }, 4000);
        axios({
          method: 'PUT',
          url: BASE_URL + '/users',
          data,
          headers: {
            Authorization: this.$cookie.get('Authorization')
          }
        })
        .then(function() {
          console.log('SUCCESS')
          // ユーザーデータの更新
          this.userData = _.clone(PROFILE)
          // 送信用データのリセット
          this.userDataTemporary = _.clone(this.userData)

          // 【ユーザーデータ内の画像を送信用データの画像で置換】
          // 1. アバター画像を変更している時
          if (this.avatar_image_preview != "") {
            let file = _.clone(PROFILE).avatar_image
            let reader = new FileReader()
            let vm = this
            reader.onload = (e) => {
              vm.userData.avatar_image = e.target.result
              vm.userDataTemporary.avatar_image = e.target.result
            }
            reader.readAsDataURL(file)
          }

          // 2. カバー画像を変更している時
          if (this.cover_image_preview != "") {
            let file = _.clone(PROFILE).cover_image
            let reader = new FileReader()
            let vm = this
            reader.onload = (e) => {
              vm.userData.cover_image = e.target.result
              vm.userDataTemporary.cover_image = e.target.result
            }
            reader.readAsDataURL(file)
          }

          // 3. トーク一覧の中の自分のデータも更新
          this.talklistTmp.forEach((item, index) => {
            let myId = this.userData.id
            let myData
            let myDataObj = this.talklistTmp[index].data.partner.filter(function(el){
              return el.id == myId
            })
            if (myDataObj.length) {
              myData = myDataObj[0]

              Object.keys(myData).forEach((key,index_) => {
                // myData[key] = _.clone(PROFILE)[key]
                myData[key] = _.clone(this.userData)[key]
              })
              // アバターを再代入
              if (this.avatar_image_preview != "") {
                let file = _.clone(this.userData).avatar_image
                let reader = new FileReader()
                let vm = this
                reader.onload = (e) => {
                  myData.avatar_image = e.target.result
                }
                reader.readAsDataURL(file)
              }
              // カバー画像を再代入
              if (this.cover_image_preview != "") {
                let file = _.clone(this.userData).cover_image
                let reader = new FileReader()
                let vm = this
                reader.onload = (e) => {
                  myData.cover_image = e.target.result
                }
                reader.readAsDataURL(file)
              }
              // 場所の名称を再代入
              let placeID = myData.current_place_id
              let placeData = this.placelist.filter(function(el){
                return el.id == placeID
              })
              myData.current_place_name = placeData[0].name
            }
          })

          this.avatar_image_preview = ""
          this.cover_image_preview = ""

          this.toast = {
            show: false,
            title: "",
            lead: "",
          }

          // ユーザーデータの更新（バックグラウンド更新）
          this.getUserData(true)

        }.bind(this))
        .catch(function(error) {
          console.log(error.response.data);
          console.log('FAILED')
          this.showToast('不明なエラー','プロフィールの更新が失敗しました。もう一度お試し下さい。','3000')
          // clearTimeout(updateNotice)
        }.bind(this))
      }
    },

    // ------------------------------
    // デバッグ用
    // ------------------------------
    LOG(value) {
      // localhostのときにコンソール表示
      if (this.isLocalhost) {
        console.log(value)
      }
    },

    // ------------------------------
    // トーク一覧を会場プルダウンによる絞り込み
    // ------------------------------
    talkListFilterPlace() {
      let currentPlaceID = this.currentPlaceID
      let allCount = 0
      let maleCount = 0
      let femaleCount = 0
      this.talklist.forEach((item, index) => {
        if (this.talklist[index].partner.current_place_id==currentPlaceID||this.talklist[index].partner.last_place_id==currentPlaceID) {
          this.talklist[index].is_current_place = true
          allCount ++
          if (this.talklist[index].partner.gender=='male') {
            maleCount ++
          }
          if (this.talklist[index].partner.gender=='female') {
            femaleCount ++
          }
        } else if(currentPlaceID=="") {
          this.talklist[index].is_current_place = true
          allCount ++
          if (this.talklist[index].partner.gender=='male') {
            maleCount ++
          }
          if (this.talklist[index].partner.gender=='female') {
            femaleCount ++
          }
        } else {
          this.talklist[index].is_current_place = false
        }

        // 移動フラグの連動
        let PARTNER = this.talklist[index].partner
        if (this.talklist[index].partner.last_place_id != "") {
          // 移動しているユーザー
          if (PARTNER.current_place_id == this.currentPlaceID) {
            // いま閲覧中の会場にいるユーザー
            this.talklist[index].is_moved = false
          } else if (this.currentPlaceID == '') {
            // 全件表示している場合
            let placeId = PARTNER.current_place_id
            let placeData = this.placelist.filter(function(el){
              return el.id == placeId
            })
            if (placeData.length) {
              // 会場一覧に相手の会場IDがある場合
              this.talklist[index].is_moved = false
            } else {
              // 会場一覧から相手の会場IDが見つからなかった場合
              this.talklist[index].is_moved = true
            }
          } else {
            this.talklist[index].is_moved = true
          }
        }
      })

      if (allCount == 0) {
        this.noResultTalk.all = true
      } else {
        this.noResultTalk.all = false
      }
      if (maleCount == 0) {
        this.noResultTalk.male = true
      } else {
        this.noResultTalk.male = false
      }
      if (femaleCount == 0) {
        this.noResultTalk.female = true
      } else {
        this.noResultTalk.female = false
      }

    },
  },

  beforeMount() {
  },

  beforeUpdate() {
  },

  updated() {

    // ------------------------------
    // 初期データ読み込み時
    // ------------------------------
    this.allEventCount = this.alleventlist.length
    this.completedCount = this.talkCompletedCount+this.userCompletedCount

    if (this.talkDataCreate == 'waiting') {
      this.loadCompleted = false
    } else if (this.talkDataCreate == 'starting') {
      if (this.allEventCount*2<=this.completedCount) {
        this.loadCompleted = true
        this.talkDataCreate = 'finished'
      } else {
        this.loadCompleted = false
      }
    } else if (this.talkDataCreate == 'finished') {
      this.loadCompleted = true
    }
    this.successCount = this.prossessData.item.filter(function(el){
      return el.completed == true
    }).length
    this.errorCount = this.prossessData.item.filter(function(el){
      return el.error == true
    }).length
    this.progressRate = this.successCount / this.prossessData.item.length
    if (this.loadCompleted==true&&this.progressRateAnimated==100) {
      this.loadCompletedAnimate = true
      setTimeout(() => {
        this.prossessData.show = false
      }, 6000)
    }
    // ローディング中にエラーが発生したら、自動で再試行
    let count = 0
    if (this.errorCount>0&&this.retryCount<10) {
      this.retryCatchErr()
    }


    // this.progressToHundred = this.progressRate*100

    setTimeout(() => {
      let cheatStep = 7
      let before = (this.progressRate*100)/cheatStep*(cheatStep-1)
      let after = 100/cheatStep
      this.progressToHundred = before + after
    }, 2000)

    // ------------------------------
    // エリア一覧の更新（都道府県とのヒモ付）
    // ------------------------------
    let prefecture = this.userDataTemporary.prefecture
    let areaByPrefecture = this.prefectureAll.filter(function(el){
      return el.value == prefecture
    })
    if (areaByPrefecture.length>0) {
      this.areaList = areaByPrefecture[0].area
    }

    // ------------------------------
    // ネットワーク接続のチェック
    // ------------------------------
    // remain のカウントアップが1秒ごとに行われているので
    this.isOnline = navigator.onLine

    // ------------------------------
    // 男女比（会場ごと）
    // ------------------------------
    Array.prototype.getLastVal = function (){
      return this[this.length -1]
    }
    this.placelist.forEach((item, index) => {
      let placeId = this.placelist[index].id
      let placeData

      if (this.userListDefault.length) {
        let allUserList = this.userListDefault
        let lastUserData = allUserList.getLastVal()
        placeData = lastUserData.data.filter(function(el){
          return el.current_place_id == placeId
        })

        // 男性のカウントを代入
        let maleCount = this.placelist[index].male_count = placeData.filter(function(el){
          return el.gender == 'male'
        }).length

        // 女性のカウントを代入
        let femaleCount = this.placelist[index].female_count = placeData.filter(function(el){
          return el.gender == 'female'
        }).length

        // 男女の比率
        if (maleCount > femaleCount) {
          // 男性が多い時
          this.placelist[index].gender_range = 'male'
        } else if (maleCount < femaleCount) {
          // 女性が多い時
          this.placelist[index].gender_range = 'female'
        } else {
          // 同じ時
          this.placelist[index].gender_range = 'equal'
        }
      } else {
        // いなかったら男性・女性のカウントをゼロに
        this.placelist[index].male_count = 0
        this.placelist[index].female_count = 0
        this.placelist[index].gender_range = 'equal'
      }
    })

    // ------------------------------
    // 現在のチェックイン会場へのアイコン
    // ------------------------------
    this.placelist.forEach((item, index) => {
      let nowPlaceId = this.userData.current_place_id
      let placeId = this.placelist[index].id
      if (nowPlaceId==placeId) {
        this.placelist[index].is_here = true
      } else {
        this.placelist[index].is_here = false
      }
    })

    // ------------------------------
    // 会場を移動したら・・・
    // ------------------------------
    if (this.placeDetail.id==this.userData.current_place_id) {
      this.switchPlace = true
    } else {
      this.switchPlace = false
    }

  },

  beforeDestroy() {
  },

  destroyed() {
  },

  watch: {
    // ------------------------------
    // 設定変更と同時にクッキーへ設定値を保存
    // ------------------------------
    // オーディオ
    audio: {
      handler(val){
        // console.log(val);
        this.settingChange()
      },
      deep: true,
    },

    // レイアウト
    layout: {
      handler(val){
        this.settingChange()
        if (val.own_avatar == 'show') {
          $('body').removeClass('is-own-hide')
        } else {
          $('body').addClass('is-own-hide')
        }
      },
      deep: true,
    },

    // レイアウト（基本的にボディのクラス付け替え）
    theme: {
      handler(val){
        this.settingChange()
        let bodyElm = document.getElementById('pagetop')
        let bodyClass = bodyElm.className
        // 1. モード
        // 「is-mode」で始まるクラスを除去し、
        // アクティブなモードのクラスを付与
        let modeVal = val.mode
        let modeClass = (bodyClass.match(/\bis-mode\S+/g) || []).join(',')
        $('body').removeClass(modeClass)
        $('body').addClass(modeVal)
        // 2. カラー
        // 「is-color」で始まるクラスを除去し、
        // アクティブなカラーのクラスを付与
        let colorVal = val.color
        let colorClass = (bodyClass.match(/\bis-color\S+/g) || []).join(',')
        $('body').removeClass(colorClass)
        $('body').addClass(colorVal)
      },
      deep: true,
    },

    // ------------------------------
    // イベント一覧のソート
    // ------------------------------
    loadCompletedAnimate: function() {
      // ロードが完了したら、イベント一覧を開始時刻順にソートする
      this.noweventlist.sort(function(before,after) {
        if(before.start_time<after.start_time) return -1
        if(before.start_time > after.start_time) return 1
        return 0
      })

      this.alleventlist.sort(function(before,after) {
        if(before.start_time<after.start_time) return -1
        if(before.start_time > after.start_time) return 1
        return 0
      })
    },

    // ------------------------------
    // ローディング進行状況の百分率対応
    // ------------------------------
    progressToHundred: function(newValue) {
      TweenLite.to(this.$data, 1.5, { progressRateTweened: newValue });
    },

    // ------------------------------
    // 送信内容に含まれる改行の個数を取得
    // ------------------------------
    send_message() {
      const str = this.send_message
      const breaks = [
        '\n'
      ]
      let ex = new RegExp(breaks.join('|'), 'g')
      if ( str.match(ex) ) {
        this.messageBrCount = ( str.match(ex) || [] ).length
        this.scrollDown()
      } else {
        this.messageBrCount = 0
      }
      console.log($('#autoHeightInput'))
      console.log($('#autoHeightInput').scrollHeight)
    },

    // ------------------------------
    // トークリスト表示のタイミングと、
    // 会場プルダウンの変更タイミングで絞り込み有効化
    // ------------------------------
    talklist(new_, old) {
      this.talkListFilterPlace()
      this.unreadCount()
      this.behindUnread()
      this.placeUnreadByEvent()
    },
    currentPlaceID(new_, old) {
      this.talkListFilterPlace()
      this.unreadCount()
      this.behindUnread()
      this.placeUnreadByEvent()
    },
    userListDefault(new_, old) {
      this.talkListFilterPlace()
      this.unreadCount()
      this.behindUnread()
      this.placeUnreadByEvent()
    },
    userList(new_, old) {
      this.talkListFilterPlace()
      this.unreadCount()
      this.behindUnread()
      this.placeUnreadByEvent()
    },

    // ------------------------------
    // 都道府県と会場の紐づけ
    // ------------------------------
    userDataTemporary(new_, old) {
      this.getAreaList(this.userDataTemporary.prefecture)
    },

    newReg(new_, old) {
      this.getAreaList(this.newReg.prefecture)
    },

    // ------------------------------
    // トークルーム表示用データにバインド
    // ------------------------------
    talkroomDefault(new_, old) {
      // ▼ ▼ ▼ 受け取ったトークデータのフォーマット化
      this.talkroom = this.talkDataFormat(this.talkroomDefault)
      // ▲ ▲ ▲ 受け取ったトークデータのフォーマット化
    },

    // ------------------------------
    // 残り時間のカウント用のデータを格納する。
    // ※ watchを使ってプロパティを監視
    // ------------------------------
    alleventlist(new_, old) {
      // プロパティの配列でループ
      new_.forEach((item, index) => {
        // alleventlistの各データに、計算した残り時間をぶっ込む（初期値）
        let DUR_TALK = this.getDuration(item.end_time)
        let DUR_VIEW = this.getDuration(moment(item.end_time).add(1, "days"))

        if (this.alleventlist.length>0) {
          this.alleventlist[index].remain = this.formatRemain(DUR_TALK)
          this.alleventlist[index].rem_view = this.formatRemain(DUR_VIEW)
          if ( DUR_TALK <= 0 ) {
            this.alleventlist[index].past = true
          }
          if ( DUR_VIEW <= 0 ) {
            this.alleventlist[index].disable = true
          }
        }

        if (this.alleventlist.length==0) {
          clearInterval(remaincount)
        }
        // 個別にsetIntervalをセットする
        let remaincount = setInterval(() => {
          // 自分のindexのカウンタを1秒ごとに更新する
          let DUR_TALK = this.getDuration(item.end_time)
          let DUR_VIEW = this.getDuration(moment(item.end_time).add(1, "days"))
          if (this.alleventlist.length>0) {
            this.alleventlist[index].remain = this.formatRemain(DUR_TALK)
            this.alleventlist[index].rem_view = this.formatRemain(DUR_VIEW)
            if ( DUR_TALK <= 0 ) {
              this.alleventlist[index].past = true
            }
            if ( DUR_VIEW <= 0 ) {
              this.alleventlist[index].disable = true
            }
          }
        }, 1000)


      });
    },
  },

  computed: {
    progressRateAnimated() {
      return this.progressRateTweened.toFixed(1)
    }
  },

  filters: {
    roundFloat(number) {
      return number.toFixed(1)
    },
    format_date_label(time) {
      return moment(time).format('YYYY/MM/DD')
    },
    year(time) {
      return moment(time).format('YYYY')
    },
    month(time) {
      return moment(time).format('MM')
    },
    date(time) {
      return moment(time).format('DD')
    },
    day(time) {
      return moment(time).format('dddd')
    },
    time(time) {
      return moment(time).format('HH:mm')
    },
    format_age(age) {
      if (age=="early_twenty") {
        return "20代前半"
      } else if (age=="late_twenty") {
        return "20代後半"
      } else if (age=="thirty") {
        return "30代"
      } else if (age=="fourty") {
        return "40代"
      } else if (age=="fifty") {
        return "50代以上"
      } else {
        return age
      }
    },
    format_gender(gender) {
      if (gender=="male") {
        return "MEN"
      } else if (gender=="female") {
        return "WOMEN"
      } else {
        return gender
      }
    },
    format_education(val) {
      if (val=="") {
        return ""
      } else if (val=="middle") {
        return "中学校卒"
      } else if (val=="high") {
        return "高等学校卒"
      } else if (val=="vocational") {
        return "専門学校卒"
      } else if (val=="junior_college") {
        return "短期大学卒"
      } else if (val=="university") {
        return "大学卒"
      } else if (val=="graduate") {
        return "大学院卒"
      } else {
        return val
      }
    },
    format_income(val) {
      if (val=="lower") {
        return "200万円以下"
      } else if (val=="annual300") {
        return "200〜300万円"
      } else if (val=="annual500") {
        return "300〜500万円"
      } else if (val=="annual1000") {
        return "500〜1,000万円"
      } else if (val=="annual2000") {
        return "1,000〜2,000万円"
      } else if (val=="annual3000") {
        return "2,000〜3,000万円"
      } else if (val=="annual5000") {
        return "3,000〜5,000万円"
      } else if (val=="annual100m") {
        return "5,000万 〜1億円"
      } else if (val=="annual200m") {
        return "1〜2億円"
      } else if (val=="annual300m") {
        return "2〜3億円"
      } else if (val=="annual500m") {
        return "3〜5億円"
      } else if (val=="higher") {
        return "5億円以上"
      } else {
        return val
      }
    },
    marked(str) {
      return marked(str)
    },
  },
})

hljs.initHighlightingOnLoad()

const fixedElem = document.querySelector('.ios-fixed-focus')
const chatView = document.querySelector('.p-scrollable--talk');
let scrollTop = window.scrollY
let chatPT
window.addEventListener('scroll', (e) => {
  scrollTop = window.scrollY
  fixedElem.style.top = scrollTop + 'px'
  chatPT = scrollTop + 'px'
  chatView.style.paddingTop = chatPT
})

// ------------------------------
// 【PCのみ】
// win : Ctrl + Enter
// Mac : Cmd + Return
// の同時押しによるトークメッセージの送信
// ------------------------------
window.addEventListener('keydown', (e) => {
  if ($('#autoHeightInput:focus').length) {
    if(e.ctrlKey||e.metaKey) {
      if(e.keyCode === 13) {
        $('#messageSend').trigger('click');
        return false;
      }
    }
  }
})

// ------------------------------
// localhost 判別でクラス付与
// ------------------------------
if (document.domain=='localhost') {
  $('body').addClass('is-localhost')
}

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

// ------------------------------
// バウンススクロール無効化
// ------------------------------

let touchY = 0;
document.body.addEventListener('touchstart', (e) => {
  touchY = e.touches[0].screenY;
});

