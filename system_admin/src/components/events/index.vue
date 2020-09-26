<template lang="pug">
  v-col(cols="12")
    ItemTable(:items="items" :headers="headers" btnTitle="新規作成" tableTitle="イベント一覧" @rowClicked="gotoShow" @btnClicked="gotoCreate")
</template>

<script>
import ItemTable from "../utils/ItemTable";
import ApiRequest from "@/api/base";
import { formatDateTime } from "@/utils/format_date";

export default {
  components: {
    ItemTable
  },
  data() {
    return {
      items: [],
      headers: [
        { text: "イベントID", value: "id" },
        { text: "イベント名", value: "name" },
        { text: "募集人数", value: "capacity" },
        { text: "主催者種別", value: "organizer_type_name" },
        { text: "開始時間", value: "start_time" },
        { text: "終了時間", value: "end_time" }
      ]
    };
  },
  async created() {
    const request = new ApiRequest("events", this.$cookie);
    const { response, error } = await request.index();
    if (!error) {
      const data = response.data;
      data.map(record => {
        record.start_time = formatDateTime(record.start_time);
        record.end_time = formatDateTime(record.end_time);
        return record;
      });
      this.items = data;
    }
  },
  methods: {
    gotoShow(data) {
      this.$router.push(`/events/${data.id}`);
    },
    gotoCreate() {
      this.$router.push("/events/create");
    },
  }
};
</script>
