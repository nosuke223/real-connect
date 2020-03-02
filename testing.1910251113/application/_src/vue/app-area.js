window.$ = window.umbrella = require('umbrellajs')
import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import placelist from './components/placelist.vue'
import ActionCable from 'actioncable'
import VueCookie from 'vue-cookie'
import VueTouch from 'vue-touch'
import VueLazyload from 'vue-lazyload'
import router from './router/area-router.js'
import VModal from 'vue-js-modal'
import _ from 'lodash'

const BASE_URL = 'https://real-connect.herokuapp.com/api/v1';
const cable = ActionCable.createConsumer('wss:real-connect.herokuapp.com/cable');

Vue.prototype.$cable = cable;
Vue.use(VModal);
Vue.use(VueCookie);
Vue.use(VueLazyload, {
    throttleWait: 400,
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
Vue.use(VueTouch, { name: 'v-touch' })

const app = new Vue({
    el: '#app',
    router,
    // 使うコンポーネント
    components: {
        App,
        placelist,
    },
    data() {
        return {
            title: {
                title: '店舗一覧',
            },
            show: true,
            search: false,
            region: [
                {
                    id: '1',
                    label: '北海道',
                },
                {
                    id: '2',
                    label: '東北',
                },
                {
                    id: '3',
                    label: '関東',
                },
                {
                    id: '4',
                    label: '中部',
                },
                {
                    id: '5',
                    label: '関西',
                },
                {
                    id: '6',
                    label: '中国',
                },
                {
                    id: '7',
                    label: '四国',
                },
                {
                    id: '8',
                    label: '九州・沖縄',
                },
            ],
            checkedLabels: [],
            forQuery: [],
            areaId: [],
            showModal: false,

            // ------------------------------
            // localhost のチェック用
            // ------------------------------
            isLocalhost: document.domain == 'localhost',

            // ------------------------------
            // デバッグ
            // ------------------------------
            // コーディングプレビュー
            preview: true,

            // ------------------------------
            // 会場リスト表示用データ
            // ------------------------------
            // 会場リスト格納用
            placelist: [],
            placelistTmp: [],

            // ------------------------------
            // 都道府県
            // ------------------------------
            prefectureAll: [],
            prefecture: [],

            // ------------------------------
            // エリア
            // ------------------------------
            areaList: [],
            areaLists: [],
            pushArea: []
        }
    },

    beforeCreate() {
    },

    created() {
        this.getPlace([1, 3, 36, 40, 41, 42]);
        // this.getPrefecture();
        // this.getAreaList([1, 2, 3, 4, 5, 40, 41, 42, 43, 44, 45, 46, 47]);
    },

    mounted() {
    },

    methods: {
        soundInit() {
        },
        click() {
            this.show = !this.show;
            this.search = !this.search;
        },
        change() {
            // チェックが外れた場合配列から除去する
            if (this.checkedLabels[this.checkedLabels.length - 1] === undefined) {
                this.resetPrefecture();
                return;
            }
            // 配列に入っていない場合そのまま代入
            if (this.checkedLabels.length == 1) {
                for (var i = 0; i <= 8; i++) {
                    if (this.checkedLabels[0].indexOf(i) >= 0) {
                        this.selectPrefecture(i);
                    }
                }
                // 配列に入っている場合は追加
            } else if (this.checkedLabels.length >= 2) {
                for (var i = 0; i <= 8; i++) {
                    if (this.checkedLabels[this.checkedLabels.length - 1].indexOf(i) >= 0) {
                        this.pushPrefecture(i);
                    }
                }
            }
        },
        selectArea() {
            // チェックが外れた場合配列から除去する
            if (this.areaLists[this.areaLists.length - 1] === undefined) {
                this.resetArea();
                return;
            }
            // 配列に入っていない場合そのまま代入
            if (this.areaLists.length == 1) {
                for (var i = 0; i < this.areaLists.length; i++) {
                    this.getAreaList(this.areaLists[i]);
                }
            } else if (this.areaLists.length >= 2) {
                this.pushArea = [this.areaLists[0]];
                for (var i = 0; i < this.areaLists.length; i++) {
                    this.pushArea.push(this.areaLists[i]);
                }
                this.getAreaList(this.pushArea);
            }
        },
        submitQuery() {
            // 一度検索されていたら一旦リセット
            this.$router.push({ path: '/area/' });

            // パラメーターをpush
            this.$router.push({ path: '/area/', query: { id: [this.forQuery] } });

            // クエリに応じて店舗を再取得
            this.areaId = this.forQuery;
            this.getPlace(this.areaId);
        },
        // ------------------------------
        // 都道府県の取得
        // ------------------------------
        getPrefecture() {
            axios({
                method: 'GET',
                // こちらは現状5県の都道府県だけ取得できる（店舗が登録済みの県のみっぽい）
                // url: BASE_URL + "/areas/prefectures",
                // ※ ▲ ▼ 一旦静的JSONで対応
                url: '../../_assets/files/prefecture.json',
                // headers: {
                //     Authorization: this.$cookie.get('Authorization')
                // },
            })
                .then(function (response) {
                    this.prefecture = response.data;
                    console.log(response.data);
                }.bind(this))
                .catch(function (error) {
                    console.error(error)
                }.bind(this))
        },

        // ------------------------------
        // エリアIDから会場一覧を取得
        // ------------------------------
        getPlace(areaId) {
            // this.areaId = [1, 3, 36, 40, 41, 42];
            if (true) {
                // エリアが登録されている時だけ処理させる
                axios({
                    method: 'GET',
                    url: BASE_URL + '/places',
                    params: {
                        area_id: areaId,
                    },
                })
                    .then(function (response) {
                        // 会場変更用データを更新
                        this.placelistTmp = response.data
                        let placeList = response.data
                    }.bind(this))
            }
        },
        // ------------------------------
        // 都道府県に属しているエリアの取得
        // ------------------------------
        getAreaList(val) {
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
                .then(function (response) {
                    this.areaList = response.data
                    console.log(response.data);

                    // // ▼ ▼ ▼ 登録エリアの変更 プルダウン表示データの作製
                    // let areaList = response.data
                    // let listData = []
                    // areaList.forEach((item, index) => {
                    //     listData[index] = {}
                    //     listData[index].text = item.name
                    //     listData[index].value = item.id
                    // })
                    // let selectedAreaId = this.areaChangeData.area_id
                    // let targetArea = areaList.filter(function (el) {
                    //     return el.id == selectedAreaId
                    // })
                    // if (targetArea.length == 0) {
                    //     // 選択中のエリアがその県になければ
                    //     blankData = {
                    //         'text': 'エリアを選択してください',
                    //         'value': selectedAreaId,
                    //         'disabled': true,
                    //     }
                    // }
                    // if (areaList.length == 0) {
                    //     // 選択中の県にエリア自体がそもそもなければ
                    //     blankData = {
                    //         'text': '現在選択中の県にエリアはありません',
                    //         'value': selectedAreaId,
                    //         'disabled': true,
                    //     }
                    // }
                }.bind(this))
                .catch(function (error) {
                    console.error(error)
                }.bind(this))
        },

        // ------------------------------
        // 現在のエリア名取得
        // ------------------------------
        setAreaName() {
            let currentAreaId = this.areaChangeData.area_id
            let currentAreaName = 'エリア名称が見つかりません'
            let areaData = this.areaList.filter(function (el) {
                return el.id == currentAreaId
            })
            if (areaData.length) {
                currentAreaName = areaData[0].name
            }
            this.currentAreaId = currentAreaId
            this.currentAreaName = currentAreaName
        },

        selectPrefecture(id) {
            if (id == 1) {
                this.prefecture = [
                    {
                        id: '1',
                        name: '北海道',
                        master_id: '1'
                    }
                ]
            }
            if (id == 2) {
                this.prefecture = [
                    {
                        id: '2',
                        name: '青森',
                        master_id: '2'
                    },
                    {
                        id: '3',
                        name: '岩手',
                        master_id: '2'
                    },
                    {
                        id: '4',
                        name: '宮城',
                        master_id: '2'
                    },
                    {
                        id: '5',
                        name: '秋田',
                        master_id: '2'
                    },
                    {
                        id: '6',
                        name: '山形',
                        master_id: '2'
                    },
                    {
                        id: '7',
                        name: '福島',
                        master_id: '2'
                    }
                ]
            }
            if (id == 3) {
                this.prefecture = [
                    {
                        id: '8',
                        name: '茨城',
                    },
                    {
                        id: '9',
                        name: '栃木',
                    },
                    {
                        id: '10',
                        name: '群馬',
                    },
                    {
                        id: '11',
                        name: '埼玉',
                    },
                    {
                        id: '12',
                        name: '千葉',
                    },
                    {
                        id: '13',
                        name: '東京',
                    },
                    {
                        id: '14',
                        name: '神奈川',
                    }
                ]
            }
            if (id == 4) {
                this.prefecture = [
                    {
                        id: '15',
                        name: '新潟',
                    },
                    {
                        id: '16',
                        name: '富山',
                    },
                    {
                        id: '17',
                        name: '石川',
                    },
                    {
                        id: '18',
                        name: '福井',
                    },
                    {
                        id: '19',
                        name: '山梨',
                    },
                    {
                        id: '20',
                        name: '長野',
                    },
                    {
                        id: '21',
                        name: '岐阜',
                    },
                    {
                        id: '22',
                        name: '静岡',
                    },
                    {
                        id: '23',
                        name: '愛知',
                    },
                ]
            }
            if (id == 5) {
                this.prefecture = [
                    {
                        id: '24',
                        name: '兵庫'
                    },
                    {
                        id: '25',
                        name: '滋賀',
                    },
                    {
                        id: '26',
                        name: '三重',
                    },
                    {
                        id: '27',
                        name: '京都',
                    },
                    {
                        id: '28',
                        name: '奈良',
                    },
                    {
                        id: '29',
                        name: '大阪',
                    },
                    {
                        id: '30',
                        name: '和歌山',
                    }
                ]
            }
            if (id == 6) {
                this.prefecture = [
                    {
                        id: '31',
                        name: '鳥取',
                    },
                    {
                        id: '32',
                        name: '岡山',
                    },
                    {
                        id: '33',
                        name: '島根',
                    },
                    {
                        id: '34',
                        name: '広島',
                    },
                    {
                        id: '35',
                        name: '山口',
                    }
                ]
            }
            if (id == 7) {
                this.prefecture = [
                    {
                        id: '36',
                        name: '香川',
                    },
                    {
                        id: '37',
                        name: '徳島',
                    },
                    {
                        id: '38',
                        name: '愛媛',
                    },
                    {
                        id: '39',
                        name: '高知',
                    }
                ]
            }
            if (id == 8) {
                this.prefecture = [
                    {
                        id: '40',
                        name: '福岡',
                    },
                    {
                        id: '41',
                        name: '佐賀',
                    },
                    {
                        id: '42',
                        name: '長崎',
                    },
                    {
                        id: '44',
                        name: '大分',
                    },
                    {
                        id: '43',
                        name: '熊本',
                    },
                    {
                        id: '45',
                        name: '宮崎',
                    },
                    {
                        id: '46',
                        name: '鹿児島',
                    },
                    {
                        id: '47',
                        name: '沖縄',
                    }
                ]
            }
        },

        pushPrefecture(id) {
            if (id == 1) {
                this.prefecture.push(
                    {
                        id: '1',
                        name: '北海道',
                    }
                )
            }
            if (id == 2) {
                // const removedUser = this.prefecture.splice(index, 1);
                // console.log(this.prefecture);
                // => [ { id: '101', name: 'Alice' }, { id: '103', name: 'Charlie' } ]
                // console.log(removedUser);
                // => [ { id: '102', name: 'Bob' } ]
                this.prefecture.push(
                    {
                        id: '2',
                        name: '青森',
                    },
                    {
                        id: '3',
                        name: '岩手',
                    },
                    {
                        id: '4',
                        name: '宮城',
                    },
                    {
                        id: '5',
                        name: '秋田',
                    },
                    {
                        id: '6',
                        name: '山形',
                    },
                    {
                        id: '7',
                        name: '福島',
                    }
                )
            }
            if (id == 3) {
                this.prefecture.push(
                    {
                        id: '8',
                        name: '茨城',
                    },
                    {
                        id: '9',
                        name: '栃木',
                    },
                    {
                        id: '10',
                        name: '群馬',
                    },
                    {
                        id: '11',
                        name: '埼玉',
                    },
                    {
                        id: '12',
                        name: '千葉',
                    },
                    {
                        id: '13',
                        name: '東京',
                    },
                    {
                        id: '14',
                        name: '神奈川',
                    }
                )
            }
            if (id == 4) {
                this.prefecture.push(
                    {
                        id: '15',
                        name: '新潟',
                    },
                    {
                        id: '16',
                        name: '富山',
                    },
                    {
                        id: '17',
                        name: '石川',
                    },
                    {
                        id: '18',
                        name: '福井',
                    },
                    {
                        id: '19',
                        name: '山梨',
                    },
                    {
                        id: '20',
                        name: '長野',
                    },
                    {
                        id: '21',
                        name: '岐阜',
                    },
                    {
                        id: '22',
                        name: '静岡',
                    },
                    {
                        id: '23',
                        name: '愛知',
                    },
                )
            }
            if (id == 5) {
                this.prefecture.push(
                    {
                        id: '24',
                        name: '兵庫'
                    },
                    {
                        id: '25',
                        name: '滋賀',
                    },
                    {
                        id: '26',
                        name: '三重',
                    },
                    {
                        id: '27',
                        name: '京都',
                    },
                    {
                        id: '28',
                        name: '奈良',
                    },
                    {
                        id: '29',
                        name: '大阪',
                    },
                    {
                        id: '30',
                        name: '和歌山',
                    }
                )
            }
            if (id == 6) {
                this.prefecture.push(
                    {
                        id: '31',
                        name: '鳥取',
                    },
                    {
                        id: '32',
                        name: '岡山',
                    },
                    {
                        id: '33',
                        name: '島根',
                    },
                    {
                        id: '34',
                        name: '広島',
                    },
                    {
                        id: '35',
                        name: '山口',
                    }
                )
            }
            if (id == 7) {
                this.prefecture.push(
                    {
                        id: '36',
                        name: '香川',
                    },
                    {
                        id: '37',
                        name: '徳島',
                    },
                    {
                        id: '38',
                        name: '愛媛',
                    },
                    {
                        id: '39',
                        name: '高知',
                    }
                )
            }
            if (id == 8) {
                this.prefecture.push(
                    {
                        id: '40',
                        name: '福岡',
                    },
                    {
                        id: '41',
                        name: '佐賀',
                    },
                    {
                        id: '42',
                        name: '長崎',
                    },
                    {
                        id: '43',
                        name: '大分',
                    },
                    {
                        id: '44',
                        name: '熊本',
                    },
                    {
                        id: '45',
                        name: '宮崎',
                    },
                    {
                        id: '46',
                        name: '鹿児島',
                    },
                    {
                        id: '47',
                        name: '沖縄',
                    }
                )
            }
        },

        resetPrefecture() {
            this.prefecture = []
        },

        resetArea() {
            this.areaList = []
        },

        placeList() {
            // ------------------------------
            // 会場一覧表示用データ取得
            // ------------------------------
            if (this.userData.area_id > 0) {
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
                    .then(function (response) {
                        // 会場表示用データを更新
                        this.placelist = response.data
                    }.bind(this))
            }
        },
        window: onload = function () {
            this.console.log('リロード');
            router.push({ path: '/area/' });
        },
        showModals(id) {
            console.log(id);
            this.$modal.show('hello-world-' + id);
        },
        hideModals(id) {
            this.$modal.hide('hello-world-' + id);
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
    },

    beforeMount() {
    },

    beforeUpdate() {
    },

    updated() {
    },

    beforeDestroy() {
    },

    destroyed() {
    },

    watch: {
    },

    computed: {
        progressRateAnimated() {
            return this.progressRateTweened.toFixed(1)
        }
    }
})

// ------------------------------
// localhost 判別でクラス付与
// ------------------------------
if (document.domain == 'localhost') {
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

// const id = '1';
// this.prefecture.findIndex((v) => v.master_id === id);
