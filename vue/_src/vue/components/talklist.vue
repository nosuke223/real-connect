<template lang="pug">
section.p-talk-list.p-talk-list--slide(:class='{"is-current-place":is_current_place}')

  figure.p-avatar.p-talk-list__avatar(v-if='partner.avatar_image' @click='modalUserDatailChild()')
    //- img.p-load-image(:src='partner.avatar_image' @load='loaded($event)')
    img.p-load-image(:src='partner.avatar_thumb_image' @load='loaded($event)')
    img.p-load-image-mirror(src='/_assets/img/common/loading.gif')

    //- .p-load-image-loader
  span.p-avatar.p-talk-list__avatar(v-else-if='partner.nickname' v-html='defaultAvatar(partner.nickname,partner.id)' @click='modalUserDatailChild()')
  span.p-avatar.p-talk-list__avatar(v-else v-html='defaultAvatar("仮",partner.id)' @click='modalUserDatailChild()')

  span.c-badge.p-talk-list__badge.u-bg--secondary.animated.bounceIn(v-if='unread_count>0') {{unread_count}}
  //- .p-talk-list__detail( data-pane='3' @click='filterTalkChild()' )
  span.p-talk-list__other-area(v-if='is_other_area==true') エリア外

  .p-talk-list__detail( @click='filterTalkChild()' )
    .p-talk-list__title
      .p-talk-list__name.p-talk-list__name--full(v-if='partner.id==0')
        | {{partner.nickname}}
        i.glyph.glyph-question-circle
      .p-talk-list__name(v-else-if='partner.nickname') {{partner.nickname}}
      .p-talk-list__name(v-else) 仮登録ユーザ ID {{partner.id}} {{partner.nickname}}
      small.p-talk-list__small(v-if='partner.id!=0') {{partner.age|format_age}} {{partner.blood}}型
        i.glyph.glyph-male(v-if='partner.gender=="male"')
        i.glyph.glyph-female(v-else-if='partner.gender=="female"')
    .p-talk-list__fashion(v-if='partner.fashion')
      i.glyph.glyph-fashion
      span {{partner.fashion}}
    .p-talk-list__fashion(v-else-if='partner.id==0')
      i.glyph.glyph-exclamation-circle
      span 退会済みユーザー

    .p-talk-list__last-message(v-if='partner.id==0') {{last_message.body}}
    .p-talk-list__last-message.is-moved.u-color--primary(v-else-if='is_moved') {{partner.current_place_name}}
    .p-talk-list__last-message(v-else-if='last_message.body==""') メッセージを送ってみよう！
    .p-talk-list__last-message(v-else) {{last_message.body}}

    .p-talk-list__remain(v-if='last_message.sent_at!=""')
      transition(name='v-progress' appear v-if='is_loading')
        .p-progress-bar.p-progress-bar--sm
      //- .p-talk-list__error(v-if='is_error') ⚠エラー:通信できません
      span.p-talk-list__remain-body
        | {{last_message.sent_at|format_date}}
        i.glyph.glyph-alarm-clock-round
        | {{last_message.sent_at|format_time}}
    .p-talk-list__remain(v-else)
      transition(name='v-progress' appear v-if='is_loading')
        .p-progress-bar.p-progress-bar--sm
      //- .p-talk-list__error(v-if='is_error') ⚠エラー:通信できません
      | -
</template>

<script>
// window.$ = window.umbrella = require('umbrellajs')
import moment from 'moment'
import VueLazyload from 'vue-lazyload'
export default {
  data() { return {
    // トークリスト用
    // ※親から取ってきたリストを使用するのでコメントアウト
    // userlistchild: [],
  }},
  props: {
    // ------------------------------
    // 親コンポーネントのデータで使用するものをピックアップ
    // （この場合は対象のユーザーのデータ）
    // ------------------------------
    last_message: Object,
    partner: Object,
    partner_id: Number,
    unread_count: Number,
    is_loading: Boolean,
    is_error: Boolean,
    is_active: Boolean,
    is_current_place: Boolean,
    is_other_area: Boolean,
    is_moved: Boolean,
    last_place_name: String,
  },
  methods: {
    // ------------------------------
    // 画像のロードが完了したら呼び出される
    // ------------------------------
    loaded(e) {
      let imgObj = e.target
      $(imgObj).addClass('is-loaded')
    },

    // ------------------------------
    // TalkList コンポーネントの childs-event 、
    // つまり親インスタンス内の filterTalk() メソッドに emit させる
    // ------------------------------
    filterTalkChild() {
      // v-event（この場合はクリック）された対象の id で
      // トークルームのデータを書き換える
      this.$emit('filtertalk-child')
    },
    // ------------------------------
    // ユーザープロフィールのモーダル
    // ------------------------------
    modalUserDatailChild() {
      this.$emit('modaluserdatail-child')
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
  },
  filters: {
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
    format_education(val) {
      if (val=="junior_high") {
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
    format_date(time) {
      return moment(time).format('YYYY/MM/DD')
    },
    format_time(time) {
      return moment(time).format('HH:mm')
    },
  },
  // watch: {
  //   partner: {
  //     handler(val){
  //       // console.log(val);
  //       val.avatar_image = val.avatar_image
  //     },
  //     deep: true,
  //   },
  // },
}
</script>
