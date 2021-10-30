<template lang="pug">
  article#pane-dashboard.l-pane.l-pane--full.is-visible(v-if="userData && userData.selectedPlace && reset == 1")
  article#pane-dashboard.l-pane.l-pane--full.is-visible(v-else-if="userData && userData.selectedPlace")
    header.l-pane__header.p-pane-control.u-mode-bg--ltSM
      .p-pane-control__heading
        span.p-pane-control__logo.cft.u-visible--ltSM Real-Connect Admin
        span.p-pane-control__title.u-visible--gtMD 参加者情報
      .p-pane-control__button( data-block='admin-profile' )
        i.glyph.glyph-account
      .p-pane-control__button( data-block='menu' )
        i.glyph ︙
    section.l-pane__body
      .p-scrollable
        // ↓ BEGIN Block Content
        .p-block-content-container
          h3 参加者一覧
          .p-block-content.p-block-content--full(v-if='users')
            label.c-checkbox
              input(type='checkbox' name='checkin' v-model="checkin" @change="requestFetchUsers(1)")
              span.c-checkbox__mirror
              | チェックインしたユーザのみ表示
            .p-pagenavi(v-if="meta && meta.total_pages > 1")
              span.p-pagenavi__page(@click='onTapPagerItem(currentPage - 1)' v-if='currentPage !== 1') «

              span.p-pagenavi__page(
                v-for="n in meta.total_pages"
                v-if="\
                  (currentPage < 7 && n < 8) ||\
                  (currentPage >= 7 && Math.abs(n - currentPage) < 4) ||\
                  (meta.total_page - currentPage < 4 && n > meta.total_pages - 7)\
                "
                @click='onTapPagerItem(n)'
                :class='{"is-current":currentPage === n}'
              ) {{ n }}

              span.p-pagenavi__page(@click='onTapPagerItem(currentPage + 1)' v-if='currentPage !== meta.total_pages') »
            table.p-event-data
              thead
                tr
                  th ユーザーID
                  th ニックネーム
                  th 性別
                  th 年齢
                  th 評価
                  th 警告数
                  th
              tbody
                tr(v-for="user in users")
                  td.p-event-data__userid.p_event_data.p-event-data__label {{user.id}}
                  td.p-event-data__nickname.p_event_data.p-event-data__label {{user.nickname ? user.nickname : user.full_name}}
                  td.p-event-data__gender.p_event_data.p-event-data__label {{user.gender|format_gender}}
                  td.p-event-data__age.p_event_data.p-event-data__label {{user.age|format_age}}
                  td.p-event-data__rating.p_event_data.p-event-data__label
                    img(:src="'/_assets/img/svg/face-' + user.rating + '.svg'")
                    span （チェックイン率：{{ user.check_in_rate }}%）
                  td.p-event-data__warning_count.p_event_data.p-event-data__label {{ user.warning_count }} 回
                  td.p-event-data__button
                    button(v-bind:disabled='user.warned == 1' :class='{"u-bg--error": user.warned != 1, "u-bg--disable": user.warned == 1}' @click="modalUserWarn(user.id, event)")
                      span(v-if='user.warned == 1') 通報済み
                      span(v-else) 通報する
      // ↑ END Block Content
</template>

<script>
import moment from 'moment';
import { request } from '../../lib/request.js';
import filters from '../../lib/filters.js';

export default {
  props: [
    'userData',
    'handleRequestError',
    'modalUserWarn',
  ],
  data() {
    return {
      event: {},
      users: [],
      meta: {},
      /**
       * イベント絞り込み
       */
      checkin: true,
    }
  },
  async created() {
    if (this.$route.params.id) {
      await this.requestFetchData(1);
    }
  },
  methods: {
    /**
     * ページャの項目選択時
     */
    onTapPagerItem(page) {
      this.requestFetchUsers(page);
    },
    /**
     * チェックインしたユーザーの取得
     */
    requestFetchData(page) {
      let reqEvent = new Promise((resolve, reject) => {
        request("GET", `/owners/events/${this.$route.params.id}`)
        .then((result) => {
          if (result.error) {
            reject(result.error)
          } else {
            resolve(result.data)
          }
        });
      })

      let reqUsers = new Promise((resolve, reject) => {
        const conditions = {
          page,
          checkin: this.checkin
        }

        request('GET', `/events/${this.$route.params.id}/users`, { params: conditions })
        .then((result) => {
          if (result.error) {
            reject(result.error)
          } else {
            resolve(result.data)
          }
        });
      })

      Promise.all([reqEvent, reqUsers]).then(([resEvent, resUsers]) => {
        this.event = resEvent

        let responseData = resUsers
        // ▼ ▼ ▼ ユーザーデータから重複をはじいて再代入する
        // 1. まずはID順にソート
        responseData.sort(function(before,after) {
          if(before.id < after.id) return -1
          if(before.id > after.id) return 1
          return 0
        })

        // 2. 次に重複チェックOKなものだけ配列にPush
        let duplicateCheckedData = []
        responseData.forEach((item, index) => {
          // MATSUO TODO: APIが消す
          Object.assign(responseData[index], {
            rating: "high",
            warning_count: 15,
            check_in_rate: 80,
            warned: 0
          });
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
        this.users = duplicateCheckedData;
        this.meta = {
            total_count: 2,
            total_pages: 1,
            current_page: 1
        }   // MATSUO TODO: APIができたらページを入れる
        this.currentPage = 1;   // MATSUO TODO: APIができたらページを入れる
        //- this.meta = response.data.meta;
        //- this.currentPage = response.data.meta.current_page;
      })
      .catch((error) => {
        this.handleRequestError(error)
      })
    },
  },
  filters,
}
</script>
