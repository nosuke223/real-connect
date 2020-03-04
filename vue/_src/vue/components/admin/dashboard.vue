<template lang="pug">
  article#pane-dashboard.l-pane.l-pane--full.is-visible

    header.l-pane__header.p-pane-control.u-mode-bg--ltSM
      .p-pane-control__heading
        span.p-pane-control__logo.cft.u-visible--ltSM Real-Connect Admin
        span.p-pane-control__title.u-visible--gtMD ダッシュボード
      .p-pane-control__button( data-block='admin-profile' )
        i.glyph.glyph-account
      .p-pane-control__button( data-block='menu' )
        i.glyph ︙
    section.l-pane__body
      .p-scrollable
        // ↓ BEGIN Block Content
        .p-block-content-container

          .p-block-content.p-block-content--full
            section
              h3 現在開催中のイベント

              .p-now-event
                .p-now-event__title 通常イベント
                .p-now-event__detail-wrap(v-for="event in events")
                  .p-now-event__detail
                    .c-date-thumb.p-now-event__date-thumb
                      .c-date-thumb__year {{ event.start_time|year }}
                      .c-date-thumb__month {{ event.start_time|month }}
                      .c-date-thumb__date {{ event.start_time|date }}
                      .c-date-thumb__day {{ event.start_time|day }}
                    .p-now-event__code
                      a(v-bind:href="'/admin/code/?check_in_code=' + event.check_in_code" target='_blank')
                        small チェックインコード
                        em {{ event.check_in_code }}
                  .p-now-event-user
                    .p-now-event-user__total
                      div
                        small 参加人数
                        em {{ event.male_count + event.female_count }}
                    .p-now-event-user__detail
                      .p-now-event-user__detail-item.male
                        small Men
                        em {{ event.male_count }}
                      .p-now-event-user__detail-item.female
                        small Women
                        em {{ event.female_count }}
                  .p-now-event-time
                    .p-now-event-time__item
                      small 開始時間
                      span {{ event.start_time|format_datetime }}
                    .p-now-event-time__item
                      small 終了時間
                      span {{ event.end_time|format_datetime }}

          .p-block-content.p-block-content--full(v-if='checkedInUsers')
            section
              h3 店舗にチェックインしたユーザー一覧
              .input-field
                label.c-checkbox(v-for='gender in genders')
                  input(type='checkbox' :value="gender.val" v-model='conditions.checkedGenders')
                  span.c-checkbox__mirror
                  | {{ gender.key }}
              .input-field
                label.c-checkbox(v-for='age in ages')
                  input(type='checkbox' :value="age.val" v-model='conditions.checkedAges')
                  span.c-checkbox__mirror
                  | {{ age.key }}
              .input-field
                span 開始日
                datepicker(
                  v-model="conditions.startAt"
                  format='yyyy-MM-dd'
                )
                span 終了日
                datepicker(
                  v-model="conditions.endAt"
                  format='yyyy-MM-dd'
                )
              button.u-bg--primary(@click='requestFetchCheckedInUsers(null)') 絞り込む

          //- .p-block-content.p-block-content--half(v-if='collectionData&&checkedInUsers')
            section
              h3 店舗にチェックインした回数
              p 合計 {{ checkedInUsers.meta.total_count }} 回
              label.c-checkbox(v-for='range in ranges')
                input(type='radio' :value="range.val" v-model='conditions.range')
                span.c-checkbox__mirror
                | {{ range.key }}
              button.u-bg--primary(@click='requestFetchCheckedInUsersCollection()') 表示
              users-line-chart(
                :collection-data='collectionData'
              )

          //- .p-block-content.p-block-content--half(v-if='collectionData&&checkedInUsers')
            section
              h3 年齢層の割合
              rate-of-age-chart(
                :collection-data='collectionData'
              )
          
          .p-block-content.p-block-content--full(v-if='checkedInUsers')
            .p-pagenavi(v-if="currentPage")
              span.p-pagenavi__page(@click='onTapPagerItem(currentPage - 1)' v-if='currentPage !== 1') «

              span.p-pagenavi__page(
                v-for="n in checkedInUsers.meta.total_pages"
                v-if="\
                  (currentPage < 7 && n < 8) ||\
                  (currentPage >= 7 && Math.abs(n - currentPage) < 4) ||\
                  (checkedInUsers.meta.total_page - currentPage < 4 && n > checkedInUsers.meta.total_pages - 7)\
                "
                @click='onTapPagerItem(n)'
                :class='{"is-current":currentPage === n}'
              ) {{ n }}
            
              span.p-pagenavi__page(@click='onTapPagerItem(currentPage + 1)' v-if='currentPage !== checkedInUsers.meta.total_pages') »

            table.p-user-data
              thead
                tr
                  th ユーザー
                  th 性別・年齢層
                  //- th 登録日時・登録会場
                  th チェックイン日時
                  //- th 備考
              tbody(v-for="checkedInUser in checkedInUsers.place_users")
                tr
                  th.p-user-data__user
                    .p-account.p-user-data-account
                      .p-account__title.p-user-data-account__title
                        figure.p-avatar.p-user-data-account__avatar( data-modal='user-detail' )
                          img(:src='checkedInUser.user.avatar_thumb_image' v-if="checkedInUser.user.avatar_thumb_image")
                          img(src='/_assets/img/avatar/default.png' v-else)
                        .p-username.p-user-data-account__username {{ checkedInUser.user.nickname }}
                  td.p-user-data__gender-age: .p-user-data__ellipse {{ checkedInUser.user.gender|format_gender }} ─ {{ checkedInUser.age|format_age }}
                  //- td.p-user-data__regist-time
                    time.p-user-data__ellipse 2017.09.15 18:21
                    .p-user-data__ellipse Alone Together 天神大名
                  td.p-user-data__last-checkin
                    .p-user-data__last-checkin-inner
                      time {{ checkedInUser.checked_in_at|format_datetime }}
                      //- span Alone Together 天神大名
                      //- .p-user-data-history-container
                        .p-user-data-history
                          | チェックイン履歴
                          .p-user-data-history__title 2018.08.18
                          ul.p-user-data-history__detail
                            li
                              time 21:45
                              span Alone Together 天神大名天神大名
                            li 
                              time 19:20
                              span Bar SUNRISE 天神今泉
                          .p-user-data-history
                            .p-user-data-history__title 2018.08.17
                            ul.p-user-data-history__detail
                              li
                                time 21:45
                                span Alone Together 天神大名
                    //- td.p-user-data__remark 備考

            //- .p-pagenavi
              span.p-pagenavi__page(data-pagination='1') 1
              span.p-pagenavi__extend ...
              span.p-pagenavi__page(data-pagination='13') «
              span.p-pagenavi__page(data-pagination='12') 12
              span.p-pagenavi__page(data-pagination='13') 13
              span.p-pagenavi__page.is-current(data-pagination='14') 14
              span.p-pagenavi__page(data-pagination='15') 15
              span.p-pagenavi__page(data-pagination='16') 16
              span.p-pagenavi__page(data-pagination='15') »
              span.p-pagenavi__extend ...
              span.p-pagenavi__page(data-pagination='34') 34
      // ↑ END Block Content
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import { request } from '../../lib/request.js';
import filters from '../../lib/filters.js';
import UsersLineChart from './charts/users-line-chart.vue';
import RateOfAgeChart from './charts/rate-of-age-chart.vue';

export default {
  components: {
    Datepicker,
    UsersLineChart,
    RateOfAgeChart
  },
  props: [
    'events',
  ],
  mounted() {
    this.requestFetchCheckedInUsers(1);
    // this.requestFetchCheckedInUsersCollection();
  },
  data() {
    return {
      /**
       * 描画用データ
       */
      checkedInUsers: null,
      collectionData: null,

      conditions: {
        checkedGenders: [1, 2],
        checkedAges: [1, 2, 3, 4, 5],
        startAt: moment().add(-1, 'months').toDate(),
        endAt: new Date(),
        range: 'daily'
      },
      currentPage: null,

      genders: [
        {key: '男性', val: 1},
        {key: '女性', val: 2}
      ],
      ages: [
        {key: '20代前半', val: 1},
        {key: '20代後半', val: 2},
        {key: '30代', val: 3},
        {key: '40代', val: 4},
        {key: '50代', val: 5}
      ],
      ranges: [
        {key: '日別', val: 'daily'},
        {key: '月別', val: 'monthly'}
      ],
    }
  },
  methods: {
    /**
     * ページャの項目選択時
     */
    onTapPagerItem(page) {
      this.requestFetchCheckedInUsers(page);
    },
    /**
     * チェックインしたユーザーの取得
     */
    requestFetchCheckedInUsers(page) {
      if (this.currentPage === page) {
        return;
      }

      const conditions = {
        age: this.conditions.checkedAges,
        gender: this.conditions.checkedGenders,
        start_at: this.conditions.startAt,
        end_at: this.conditions.endAt,
        page,
      }

      request('GET', '/owners/users', { params: conditions })
      .then((result) => {
        this.checkedInUsers = result.data;
        this.currentPage = result.data.meta.current_page;
      })
    },
    /**
     * チェックインしたユーザーの集計用データ取得
     */
    requestFetchCheckedInUsersCollection() {
      const conditions = {
        range: this.conditions.range,
        start_at: this.conditions.startAt,
        end_at: this.conditions.endAt
      }

      request('GET', '/owners/users/collection', { params: conditions })
      .then((result) => {
        this.collectionData = result.data;
      })
    },
  },
  filters,
}
</script>