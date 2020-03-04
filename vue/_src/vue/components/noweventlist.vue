<template lang="pug">
  section.p-event-list.is-now-event(:data-event='"id:"+id' :data-modal='is_checked_in ? "" : "check-in"' :class='{"is-checked-in": is_checked_in}' @click='talkListUpdateChild(id)' v-if='past!=true')
    .c-date-thumb
      .c-date-thumb__year {{start_time|year}}
      .c-date-thumb__month {{start_time|month}}
      .c-date-thumb__date {{start_time|date}}
      .c-date-thumb__day {{start_time|day}}
    span.c-badge.p-event-list__badge.u-bg--secondary.animated.bounceIn(v-if='unread_count>0') {{unread_count}}
    .p-event-list__detail
      .p-event-list__name(v-if='name') {{name}}
      .p-event-list__gender-rate
        .p-event-list__label 男女比
        .p-event-list__rate-container
          span.p-event-list__rate {{male_count}}
            small 名
          | ：
          span.p-event-list__rate {{female_count}}
            small 名
      .p-event-list__check-in-status
        i.glyph.glyph-check-circle
        span(v-if='is_checked_in') チェックインしています
        span(v-else) チェックインしていません
      .p-event-list__remain(v-if='past==false')
        i.glyph.glyph-alarm-clock-round
        | 残り時間　あと
        span {{remain}}
      .p-event-list__remain(v-else) このイベントは終了しました
</template>

<script>
import moment from 'moment'
export default {
  data() { return {
    counts: [],
  }},
  props: {
    // ------------------------------
    // 親コンポーネントのデータで使用するものをピックアップ
    // （この場合は対象のイベントのデータ）
    // ------------------------------
    id: Number,
    is_checked_in: Boolean,
    start_time: String,
    end_time: String,
    male_count: Number,
    female_count: Number,
    unread_count: Number,
    remain: String,
    rem_view: String,
    past: Boolean,
    disable: Boolean,
    name: String,
  },
  methods: {
    // // ------------------------------
    // // noweventlist コンポーネントの childs-event 、
    // // つまり親インスタンス内の filterEvent() メソッドに emit させる
    // // ------------------------------
    // filterEventChild(id) {
    //   // v-event（この場合はクリック）された対象の id で
    //   // トークリストのデータを書き換える
    //   this.$emit('childs-event',id)
    // },
    // ------------------------------
    // noweventlist コンポーネントの @talk-list-update-child 、
    // つまり親インスタンス内の talkListUpdate() メソッドに emit させる
    // ------------------------------
    talkListUpdateChild(id) {
      // v-event（この場合はクリック）された対象の id で
      // トークリストのデータを書き換える
      this.$emit('talk-list-update-child',id)
    },
  },
  computed: {},
  filters: {
    format_test(time) {
      return moment(time).format('YYYY/MM/DD HH:mm')
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
  },
}
</script>
