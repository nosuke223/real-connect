<template lang="pug">
  article#pane-dashboard.l-pane.l-pane--full.is-visible(v-if="userData && userData.selectedPlace")

    header.l-pane__header.p-pane-control.u-mode-bg--ltSM
      .p-pane-control__heading
        span.p-pane-control__logo.cft.u-visible--ltSM Real-Connect Admin
        span.p-pane-control__title.u-visible--gtMD イベント情報
      .p-pane-control__button( data-block='admin-profile' )
        i.glyph.glyph-account
      .p-pane-control__button( data-block='menu' )
        i.glyph ︙
    section.l-pane__body
      .p-scrollable
        // ↓ BEGIN Block Content
        .p-block-content-container
          h3 イベント一覧
          .p-block-content.p-block-content--full(v-if='events')
            label.c-checkbox
              input(type='checkbox' name='nowFlag' v-model="nowFlag" @change="requestFetchEvents(1)")
              span.c-checkbox__mirror
              | 開催中のイベントのみ表示
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
                  th イベントID
                  th イベント名
                  th 募集人数
                  th 主催者種別
                  th 開始時間
                  th 終了時間
                  th
              tbody
                tr.clickable(v-for="event in events" @click="goToEditPage(event.id)")
                  td.p-event-data__id.p_event_data.p-event-data__label {{event.id}}
                  td.p-event-data__name.p_event_data.p-event-data__label {{event.name}}
                  td.p-event-data__capacity.p_event_data.p-event-data__label {{event.capacity}}
                  td.p-event-data__organizer_type.p_event_data.p-event-data__label {{event.organizer_type_name}}
                  td.p-event-data__start_time.p_event_data.p-event-data__label {{event.start_time|format_datetime}}
                  td.p-event-data__end_time.p_event_data.p-event-data__label {{event.end_time|format_datetime}}
                  td.p-event-data__button
                    button.u-bg--primary(@click.stop="") 参加者
                    button.u-bg--error(@click.stop="deleteEvent(event.id)") 削除
            button(@click="goToCreate()") イベント作成
      // ↑ END Block Content
</template>

<script>
import moment from 'moment';
import { request } from '../../lib/request.js';
import filters from '../../lib/filters.js';

export default {
  props: [
    'userData',
  ],
  watch: {
    'userData.selectedPlace': {
      immediate: true,
      handler() {
        if (this.userData && this.userData.selectedPlace) {
         this.requestFetchEvents(1);
        }
      }
    }
  },
  data() {
    return {
      /**
       * 描画用データ
       */
      events: [],
      meta: {},
      /**
       * イベント絞り込み
       */
       nowFlag: true,
    }
  },
  methods: {
    /**
     * ページャの項目選択時
     */
    onTapPagerItem(page) {
      this.requestFetchEvents(page);
    },
    /**
     * チェックインしたユーザーの取得
     */
    requestFetchEvents(page) {
      const conditions = {
        page,
        place_id: this.userData.selectedPlace.id,
        now: this.nowFlag
      }

      request('GET', '/owners/events', { params: conditions })
      .then((result) => {
        this.events = result.data.events;
        this.meta = result.data.meta;
        this.currentPage = result.data.meta.current_page;
      });
    },
    deleteEvent(id) {
      const result = confirm('イベントを削除します。よろしいですか。');
      if (!result) return;
      request('DELETE', `/owners/events/${id}`, {})
      .then((result) => {
        alert('イベントを削除しました');
        this.$router.go('/admin');
      });
    },
    goToCreate() {
      this.$router.push('/admin/event');
    },
    goToEditPage(id) {
      this.$router.push(`/admin/event/${id}/edit`);
    }
  },
  filters,
}
</script>
