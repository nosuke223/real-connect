<template lang="pug">
  section.p-event-list(:data-event='"id:"+id' :data-pane='disable ? "" : "2"' :data-modal='is_checked_in ? "" : "check-in"' :class='{"is-enabled":!disable}' @click='talkListUpdateChild(id)' v-if='past==true&&is_checked_in==true')
    .p-event-list__info-container
      .c-date-thumb
        .c-date-thumb__year {{start_time|year}}
        .c-date-thumb__month {{start_time|month}}
        .c-date-thumb__date {{start_time|date}}
        .c-date-thumb__day {{start_time|day}}
      span.c-badge.p-event-list__badge.u-bg--secondary.animated.bounceIn(v-if='unread_count==0') {{unread_count}}
      .p-event-list__info
        .p-event-list__name(v-if='name') {{name}}
        .p-event-list__organizer-place(v-if='place_name')
          img(:src='"/_assets/img/svg/home.svg"')
          span {{place_name}}
        .p-event-list__organizer-user(v-if='user_name')
          img(:src='"/_assets/img/svg/boy.svg"')
          span {{user_name}}
        .p-event-list__period
          img(:src='"/_assets/img/svg/time.svg"')
          span {{start_time|hhmm}} - {{end_time|hhmm}}
          img.p-event-list__period-right(:src='"/_assets/img/svg/flag.svg"')
          span {{event_status.name}}
    .p-event-list__detail
      .p-event-list__gender-rate
        .p-event-list__label 男女比
        .p-event-list__rate-container
          span.p-event-list__rate {{male_count}}
            small 名
          | ：
          span.p-event-list__rate {{female_count}}
            small 名
      .p-event-list__check-in-status(v-if='disable')
        i.glyph.glyph-ban
        | 終了しました
      .p-event-list__check-in-status(v-else)
        i.glyph.glyph-exclamation-circle
        | 閲覧のみ可能
      .p-event-list__remain(v-if='disable==false')
        i.glyph.glyph-alarm-clock-round
        | 閲覧時間　あと
        span {{rem_view}}
      .p-event-list__remain(v-else)
        i.glyph.glyph-alarm-clock-round
        | 閲覧できる時間を過ぎています
</template>

<script>
import moment from 'moment'
export default {
  data() { return {
    counts: [],
    place_name: 'イタリアンバル　◯◯地下街 101A',
    // user_name: '出口 格', // API実装後消す
    organizer_type: 2000, // API実装後消す
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
    event_status: Object,
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
    hhmm(time) {
      return moment(time).format('HH:mm')
    },
  },
}
</script>
