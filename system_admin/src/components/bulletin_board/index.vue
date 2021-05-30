<template lang="pug">
  v-col(cols="12")
    v-card.mx-auto(max-width="600px")
      v-card-title.headline 街deつながる&trade;全国会議
      v-card-subtitle powerd by りあこね&trade;
      v-tabs(v-model="tab")
        v-tab(href="#tab_info") お知らせ
        v-tab(href="#tab_event") 掲示板
        v-tabs-items(v-model="tab")
          v-tab-item(value="tab_info")
            v-alert.mb-0(border="bottom" colored-border type="info" icon="mdi-new-box") News
            InfoLists(:items="systemBbsNews")
            v-alert.mb-0(border="bottom" colored-border type="info" color="success") Info
            InfoLists(:items="systemBbsInfos")
          v-tab-item(value="tab_event")
            div.ma-2
              v-btn(dark slot="activator" color="teal accent-4" rounded @click="showDialog()") エリアを絞り込む
              AreaSearch(ref="dialog" @selectedArea="fetchEvents")
            div.ma-2(v-if="selectedArea.name")
              v-chip.ma-1(label outlined close color="secondary" @click:close="resetArea") {{selectedArea.name}}
            EventLists(:events="events")
      v-card-actions
        v-btn(color="primary" text to="/place_application/create" target="_blank" rel="noopener") 店舗新規登録
        v-spacer
        v-btn(color="primary" text :href="getEnduserUrl()" target="_blank" rel="noopener") エンドユーザー様
</template>

<script>
import ApiRequest from "@/api/base";
import InfoLists from "./InfoLists";
import EventLists from "./EventLists";
import AreaSearch from "./AreaSearch";
import { formatDateTime } from "@/utils/format_date";

export default {
  components: {
    InfoLists,
    EventLists,
    AreaSearch
  },
  data() {
    return {
      systemBbsInfos: [],
      systemBbsNews: [],
      tab: "tab_info",
      events: [],
      selectedArea: {}
    };
  },
  created() {
    this.fetchBbsInfos();
    this.fetchBbsNews();
    this.selectTab();
    let area = {id: null}
    if (this.$route.query.area_id) {
      area.id = this.$route.query.area_id;
      area.name = this.$route.query.area_name;
      this.selectedArea = area;
    }
    this.fetchEvents(area);
  },
  methods: {
    async fetchBbsInfos() {
      const request = new ApiRequest(
        "system_bbs_infos/?display_flag=true",
        this.$cookie
      );
      const { response, error } = await request.index();
      if (!error) {
        this.systemBbsInfos = response.data.map(record => {
          return {
            title: record.display_date,
            text: record.detail
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
        this.systemBbsNews = response.data.map(record => {
          return {
            title: record.display_date,
            text: record.detail
          };
        });
      }
    },
    async fetchEvents(areaObj) {
      this.selectedArea = areaObj;
      let uri = "";
      if (areaObj.id) {
        uri = `events?area_id=${areaObj.id}&now=true`;
      } else {
        uri = 'events?now=true';
      }
      const request = new ApiRequest(
        uri,
        this.$cookie
      );
      const { response, error } = await request.index();
      if (!error) {
        const data = response.data;
        data.map(record => {
          record.start_time = formatDateTime(record.start_time);
          record.end_time = formatDateTime(record.end_time);
          return record;
        });
        this.events = data;
      }
    },
    selectTab() {
      const tab = this.$route.query.tab;
      if (tab === "info") {
        this.tab = "tab_info";
      } else if (tab === "event") {
        this.tab = "tab_event";
      }
    },
    showDialog() {
      this.$refs.dialog.open();
    },
    async resetArea() {
      this.selectedArea = {};
      await this.fetchEvents({id: null});
      this.$router.push('/bulletin_board?tab=event');
    },
    getEnduserUrl() {
      return document.domain=='localhost' ? 'http://localhost:3000/user/' : 'https://realconnect.ddns.net:3000/user/';
    }
  }
};
</script>
