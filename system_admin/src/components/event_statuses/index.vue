<template lang="pug">
  v-col(cols="12")
    ItemTable(:items="items" :headers="headers" btnTitle="新規作成" tableTitle="イベントステータス一覧" @rowClicked="gotoShow" @btnClicked="gotoCreate")
</template>

<script>
import ItemTable from "../utils/ItemTable";
import ApiRequest from "@/api/base";

export default {
  components: {
    ItemTable,
  },
  data() {
    return {
      items: [],
      headers: [
        { text: "ID", value: "id" },
        { text: "名前", value: "name" },
      ],
    };
  },
  async mounted() {
    const request = new ApiRequest("event_statuses", this.$cookie);
    const { response, error } = await request.index();
    if (!error) {
      this.items = response.data;
    }
  },
  methods: {
    gotoShow(data) {
      this.$router.push(`/event_statuses/${data.id}`);
    },
    gotoCreate() {
      this.$router.push("/event_statuses/create");
    },
  },
};
</script>
