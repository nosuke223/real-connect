<template lang="pug">
section.p-place-list
  .p-place-list__title
    .p-place-list__shop
      i.glyph.glyph-map-marker-alt.u-color--secondary(v-if='is_here')
      | {{name}}
    span.c-badge.p-place-list__badge.u-bg--secondary.animated.bounceIn(v-if='unread_count>0') {{unread_count}}
  label.p-cover.p-place-list__cover( @click='placeDetailActiveC()')
    img.is_origin(v-if='cover_image' :src='cover_image')
    img.is_default(:src='"/_assets/img/default_svg/default-"+ String(id).slice(-2) +".svg"' v-else)
  .p-place-list__address
    a(:href='"https://www.google.co.jp/maps/search/"+address' target='_blank' v-if='address')
      i.glyph.glyph-map-marker
      span
        em {{address}}
  .p-place-list__container
    .p-place-list__telephone
      img(:src='"/_assets/img/svg/phone.svg"')
      span
        em {{telephone}}
    a(:href='url' target='_blank' v-if='url')
      | HPはこちら

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
