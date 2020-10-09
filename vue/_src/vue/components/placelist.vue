<template lang="pug">
section.p-talk-list
  figure.p-avatar.p-avatar--rect.p-talk-list__avatar(v-if='logo_image' @click='adminDetailActiveC()')
    img(v-lazy='logo_image')
  span.p-avatar.p-avatar--rect.p-talk-list__avatar(v-else v-html='defaultAvatar(name,id)' @click='adminDetailActiveC()')

  span.c-badge.p-talk-list__badge.p-talk-list__badge--place.u-bg--secondary.animated.bounceIn(v-if='unread_count>0') {{unread_count}}

  .p-talk-list__detail.p-talk-list__detail--place( @click='placeDetailActiveC()')
    .p-talk-list__title
      .p-talk-list__shop
        i.glyph.glyph-map-marker-alt.u-color--secondary(v-if='is_here')
        | {{name}}
    .p-talk-list__address
      i.glyph.glyph-map-marked-alt
      span {{address}} {{building}}
    .p-talk-list__gender-rate

      .p-talk-list__seat-status(v-if='seat_status=="full"')
        span 満席
      .p-talk-list__seat-status(v-else-if='seat_status=="few"')
        span 空
        span 少


      .p-talk-list__label
        span.u-hidden--inMD 現在の
        | 男女比

      .p-talk-list__rate-container(v-if='gender_range=="male"')
        i.glyph.glyph-male.u-male
        i.glyph.u-gradtypes 
        i.glyph.glyph-female.u-female.glyph-xs
      .p-talk-list__rate-container(v-if='gender_range=="female"')
        i.glyph.glyph-male.u-male.glyph-xs
        i.glyph.u-gradtypes 
        i.glyph.glyph-female.u-female
      .p-talk-list__rate-container(v-if='gender_range=="equal"')
        i.glyph.glyph-male.u-male.glyph-sm
        i.glyph.u-gradtypes 
        i.glyph.glyph-female.u-female.glyph-sm
      //- .p-talk-list__rate-container
        span.p-talk-list__rate {{male_count}}
          small 名
        | ：
        span.p-talk-list__rate {{female_count}}
          small 名
</template>

<script>
import axios from 'axios'
export default {
  data() { return {
    // ユーザーリスト用
    // ※親から取ってきたリストを使用するのでコメントアウト
    // placelistchild: [],
  }},
  props: {
    address: String,
    building: String,
    cover_image: String,
    description: String,
    female_count: Number,
    id: Number,
    logo_image: String,
    male_count: Number,
    name: String,
    note: String,
    telephone: String,
    type: String,
    url: String,
    is_full: Boolean,
    is_here: Boolean,
    gender_range: String,
    unread_count: Number,
    seat_status: String,
  },
  methods: {
    placeDetailActiveC() {
      this.$emit('childs-event')
    },
    adminDetailActiveC() {
      // 廃止
      // this.$emit('modaladmindatail-child')
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
}
</script>

<style lang="css">
</style>
