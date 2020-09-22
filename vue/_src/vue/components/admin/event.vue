<template lang="pug">
    article#event.l-pane.l-pane--full.is-visible
      header.l-pane__header.p-pane-control.u-mode-bg--ltSM
        .p-pane-control__heading
          span.p-pane-control__logo.cft.u-visible--ltSM Real-Connect Admin
          span.p-pane-control__title.u-visible--gtMD {{pageTitle}}
        .p-pane-control__button( data-block='admin-profile' )
          i.glyph.glyph-account
        .p-pane-control__button( data-block='menu' )
          i.glyph ︙
      section.l-pane__body
        .p-scrollable
          // ↓ BEGIN Block Content
          .p-block-content-container
            .p-block-content.p-block-content--full
              .p-editor-content
                section
                  h3 種別
                    p イベントの種別を選択してください
                    .input-field
                      label.c-select
                        select.c-select__item(v-model="event.event_status_id")
                          template(v-if="eventStatuses.length > 0")
                            option(v-for="eventStatus of eventStatuses" :value="eventStatus.id" :key="eventStatus.id") {{eventStatus.name}}
                        i.glyph.glyph-cart-right
                section
                  h3 イベント日時
                    p 開始日を入力してください
                    .input-field
                      datepicker(
                        v-model="event.start_time"
                        format='yyyy-MM-dd'
                      )
                    p 終了日を入力してください
                    .input-field
                      datepicker(
                        v-model="event.end_time"
                        format='yyyy-MM-dd'
                      )
                    .c-opentime-field(v-for="prefix in eventTimePrefixes")
                      div
                        p(v-if="prefix === 'start'") 開始時刻
                        p(v-else) 終了時刻
                      .c-opentime-field__body
                        .c-opentime-field__select
                          .c-opentime-field__select-group
                            select.c-select-default(v-model="event[prefix + '_time_hour']")
                              option(value='' disabled) --
                              - for (h = 0; h < 18; h++)
                                - h = ( '00' + h ).slice( -2 )
                                option(value=h) #{h}
                              option(value='18' selected) 18
                              - for (h = 19; h < 24; h++)
                                - h = ( '00' + h ).slice( -2 )
                                option(value=h) #{h}
                            select.c-select-default(v-model="event[prefix + '_time_minute']")
                              option(value='' disabled) --
                              - for (m = 0; m < 12; m++)
                                - let m_ = m * 5
                                - m_ = ( '00' + m_ ).slice( -2 )
                                option(value=m_) #{m_}
                section
                  h3 募集年代
                  p 募集する年代を選択してください
                  .input-field
                    input(type='number' name='from' autocomplete='off' placeholder='入力してください' v-model='event.from' )
                    i.glyph.glyph-pen
                    i.glyph.glyph-check-circle.u-color--primary01
                  p 歳から
                  .input-field
                    input(type='number' name='to' autocomplete='off' placeholder='入力してください' v-model='event.to' )
                    i.glyph.glyph-pen
                    i.glyph.glyph-check-circle.u-color--primary01
                  p 歳まで
                section
                  h3 募集人数
                  p 募集人数を入力してください
                  .input-field
                    input(type='text' name='capacity' autocomplete='off' placeholder='入力してください' v-model='event.capacity' )
                    i.glyph.glyph-pen
                    i.glyph.glyph-check-circle.u-color--primary01
                section
                  h3 イベント名
                  p イベント名を入力してください
                  .input-field
                    input(type='text' name='name' autocomplete='off' placeholder='入力してください' v-model='event.name' )
                    i.glyph.glyph-pen
                    i.glyph.glyph-check-circle.u-color--primary01
                section
                  h3 イベント注意事項
                  p イベントの注意事項を入力してください
                  .input-field
                    textarea(name='detail' placeholder='入力してください' v-model='event.detail')
                    i.glyph.glyph-pen
                    i.glyph.glyph-check-circle.u-color--primary01
                .p-block-content.submit-button-area
                  button.u-bg--primary(@click='requestPostEvent()') 保存する
                  button.u-bg--primary(@click='goBackTop()' style="margin-left: 15px;") キャンセル

</template>

<script>
import Datepicker from "vuejs-datepicker";
import { request } from "../../lib/request.js";
import filters from "../../lib/filters.js";
import _ from "lodash";
import moment from "moment";

export default {
  props: ["userData", "handleRequestError"],
  components: {
    Datepicker,
  },
  data() {
    return {
      /**
       * モデル用データ
       */
      id: this.$route.params.id,
      event: {
        event_status: null,
        start_time: new Date(),
        start_time_hour: "00",
        start_time_minute: "00",
        end_time: new Date(),
        end_time_hour: "00",
        end_time_minute: "00",
        name: "",
        detail: "",
        capacity: "",
        event_status_id: null,
        from: 20,
        to: 20
      },
      eventStatuses: [],
      eventTimePrefixes: ["start", "end"]
    };
  },
  computed: {
    pageTitle() {
      let title;
      if (this.id) {
        title = 'イベント編集';
      } else {
        title = 'イベント作成';
      }
      return title;
    }
  },
  async created() {
    await this.requestFetchEventStatuses();
    if (this.id) {
      this.requestFetchEvent();
    }
  },
  methods: {
    /**
     * イベントステータスの一覧を取得する
     */
    requestFetchEventStatuses() {
      request("GET", "/owners/event_statuses").then((result) => {
        if (result.error) {
        } else {
          this.eventStatuses = result.data;
        }
      });
    },
    requestFetchEvent() {
      request("GET", `/owners/events/${this.$route.params.id}`).then((result) => {
        if (result.error) {
        } else {
          this.event = result.data;
          this.timeFormat();
        }
      });
    },
    requestPostEvent() {
      // 必須入力値チェックを入れる
      const event = this.event;
      let startTime;
      let endTime;
      this.eventTimePrefixes.forEach((prefix) => {
        const eventDate = moment(event[`${prefix}_time`]).format("YYYY-MM-DD");
        const hour = event[`${prefix}_time_hour`];
        const minute = event[`${prefix}_time_minute`];
        const dateTime = moment(`${eventDate} ${hour}:${minute}`);
        if (prefix === "start") {
          startTime = dateTime.format("YYYY-MM-DD HH:mm:ss");
        } else {
          endTime = dateTime.format("YYYY-MM-DD HH:mm:ss");
        }
      });
      const data = {
        event: {
          event_status_id: event.event_status_id,
          start_time: startTime,
          end_time: endTime,
          name: event.name,
          detail: event.detail,
          capacity: this.event.capacity,
          organizer_name: this.userData.nickname,
          organizer_type: 2000,
          organize_user_id: this.userData.id,
          area_id: this.userData.selectedPlace.area_id,
          from: this.event.from,
          to: this.event.to,
          organize_place_id: this.userData.selectedPlace.id
        }
      };
      if (this.id) {
        request("PUT", `/owners/events/${this.id}`, { data }).then((result) => {
          if (result.error) {
            let erros = {};
            erros.messages = result.error.result.join("\n");
            this.handleRequestError(erros);
          } else {
            alert("イベントの更新が完了しました");
            this.$router.push("/admin");
          }
        });
      } else {
        request("POST", "/owners/events", { data }).then((result) => {
          if (result.error) {
            let erros = {};
            erros.messages = result.error.result.join("\n");
            this.handleRequestError(erros);
          } else {
            alert("イベントの作成が完了しました");
            this.$router.push("/admin");
          }
        });
      }
    },
    /**
     * キャンセルボタン押下時
     */
    goBackTop() {
      this.$router.push('/admin');
    },
    /**
     * 開始時刻・終了時刻を時・分に分解して保持
     */
    timeFormat() {
      this.eventTimePrefixes.forEach((prefix) => {
        if (this.event[`${prefix}_time`]) {
          this.event[`${prefix}_time_hour`] = filters.hours(this.event[`${prefix}_time`]);
          this.event[`${prefix}_time_minute`] = filters.minutes(this.event[`${prefix}_time`]);
        }
      });
    },
  },
};
</script>
