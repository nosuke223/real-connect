<template lang="pug">
  li.p-chat__item-wrap(:class='{"is-latest":is_latest==true}')
    .p-chat__date-label.is-firstdate(v-if='firstdate')
      span {{firstdate}}
    .p-chat__date-label(v-if='date')
      span {{date}}
    .p-chat__date-label--time(v-if='updatetime')
      span ─　{{updatetime}}　─
    .p-chat__item(:class='{"is-send-message":direction == "to","is-received-message":direction == "from"}' v-if='!loading' :data-message-id='id')

      figure.p-avatar.p-chat__avatar(v-if='avatar' @click='modalUserDatailChild()')
        //- img(v-lazy='avatar')
        img.p-load-image(:src='avatar' @load='loaded($event)')
        img.p-load-image-mirror(src='/_assets/img/common/loading.gif')
      span.p-avatar.p-chat__avatar(v-else v-html='defaultAvatar(sender.nickname,sender.id)' @click='modalUserDatailChild()')

      span.p-chat__box.bounceIn(:class='{"animated":is_latest==true}')
        small.p-chat__comment.u-mode-bg.p-marked(:class='emoji(body)' v-html='nl2br(body)')

        //- small.p-chat__comment.u-mode-bg.p-marked(:class='emoji(body)' v-html='body')
        b.p-chat__date
          br
          | {{sent_at|format_time}}
</template>

<script>
// window.$ = window.umbrella = require('umbrellajs')
import Loading from './loading.vue'
import moment from 'moment'
export default {
  components: { Loading },
  data() { return {
  }},
  props: {
    // ------------------------------
    // 親コンポーネントのデータで使用するものをピックアップ
    // （この場合は対象のトーク部屋のデータ）
    // ------------------------------
    date: String,
    updatetime: String,
    firstdate: String,
    direction: String,
    avatar: String,
    // avatar: Object,
    body: String,
    sent_at: String,
    sender: Object,
    id: Number,
    is_latest: Boolean,
    is_other_area: Boolean,
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
    // 改行コードのbrタグへの変換
    // ------------------------------
    nl2br(str) {
      if (str.length) {
        return str.replace(/\\n|\r\n|\r|\n/g, "<br>")
        // return str.replace(/\n/g, "<br>")
        // return str
      }
    },

    // ------------------------------
    // 絵文字1字のみの場合にクラス付与
    // ------------------------------
    emoji(str) {
      const ranges = [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\ude4f]',
        '\ud83d[\ude80-\udeff]',
        '\ud7c9[\ude00-\udeff]',
        '[\u2600-\u27BF]'
      ]
      let ex = new RegExp(ranges.join('|'), 'g')
      if (str.length) {
        let count = str.length
        if ( count == 10 && str.match(ex) ) {
          return 'emoji'
        } else {
          if (str.match(' ')&&count == 1) {
            return 'brand-logo'
          } else {
            return 't-'+count+'_'
          }
        }
      } else {
        return 'brand-logo'
      }
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
    format_time(time) {
      return moment(time).format('HH:mm')
    },
  },

  created() {
  },

  updated() {
  },
}
</script>

<style lang="css">
</style>
