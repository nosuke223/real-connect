<template lang="pug">
  v-col(cols="12")
    v-card.mx-auto(max-width="600px")
      v-card-title.headline 街deつながる&trade;全国会議
      v-card-subtitle powerd by りあこね&trade;
      v-tabs(v-model="tab")
        v-tab お知らせ
        v-tab 掲示板
        v-tabs-items(v-model="tab")
          v-tab-item
            v-alert.mb-0(border="bottom" colored-border type="info" icon="mdi-new-box") News
            InfoLists(:items="systemBbsNews")
            v-alert.mb-0(border="bottom" colored-border type="info" color="success") Info
            InfoLists(:items="systemBbsInfos")
          v-tab-item
            EventLists(:events="events")
      v-card-actions
        v-btn(color="primary" text to="/place_application/create" target="_blank" rel="noopener") 店舗新規登録
        v-spacer
        v-btn(color="primary" text href="https://real-connect.jp/" target="_blank" rel="noopener") エンドユーザー様
</template>

<script>
import ApiRequest from "@/api/base";
import InfoLists from "./InfoLists";
import EventLists from "./EventLists";
import { formatDateTime } from "@/utils/format_date";
import { countParticipant } from "@/utils/event";

export default {
  components: {
    InfoLists,
    EventLists,
  },
  data() {
    return {
      systemBbsInfos: [],
      systemBbsNews: [],
      tab: null,
      events: [],
    };
  },
  created() {
    this.fetchBbsInfos();
    this.fetchBbsNews();
    this.fetchEvents();
  },
  methods: {
    async fetchBbsInfos() {
      const request = new ApiRequest(
        "system_bbs_infos/?display_flag=true",
        this.$cookie
      );
      const { response, error } = await request.index();
      if (!error) {
        this.systemBbsInfos = response.data.map((record) => {
          return {
            title: record.display_date,
            text: record.detail,
          };
        });
      }
    },
    async fetchBbsNews() {
      const request = new ApiRequest(
        "system_bbs_news/?display_flag=true",
        this.$cookie
      );
      const { response, error } = await request.index();
      if (!error) {
        this.systemBbsNews = response.data.map((record) => {
          return {
            title: record.display_date,
            text: record.detail,
          };
        });
      }
    },
    async fetchEvents() {
      const request = new ApiRequest("events", this.$cookie);
      const { response, error } = await request.index();
      if (!error) {
        const data = response.data;
        data.map((record) => {
          record.start_time = formatDateTime(record.start_time);
          record.end_time = formatDateTime(record.end_time);
          const { male, female } = countParticipant(record.users);
          record.male = `${male}人`;
          record.female = `${female}人`;
          return record;
        });
        this.events = data;
      }
    },
  },
};
</script>
