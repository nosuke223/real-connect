<template lang="pug">
  v-col(cols="12")
    ItemTable(:items="items" :headers="headers"  tableTitle="メッセージ一覧" @rowClicked="gotoShow")
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
        { text: "メッセージID", value: "id" },
        { text: "イベント名", value: "event.name" },
        { text: "メッセージ内容", value: "body" },
        { text: "パートナー名", value: "partner_nickname" },
        { text: "送信者名", value: "sender_nickname" },
      ],
    };
  },
  async created() {
    const request = new ApiRequest("messages", this.$cookie);
    const { response, error } = await request.index();
    if (!error) {
      this.items = response.data;
    }
  },
  methods: {
    gotoShow(data) {
      this.$router.push(`/messages/${data.id}`);
    },
  },
};
</script>
