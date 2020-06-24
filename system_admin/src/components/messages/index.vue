<template lang="pug">
  v-col(cols="12")
    ItemTable(:items="items" :headers="headers" btnTitle="新規作成" tableTitle="メッセージ一覧" @rowClicked="gotoShow" @btnClicked="gotoCreate")
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
        { text: "イベント名", value: "event.name" },
        { text: "メッセージ内容", value: "body" },
        { text: "送信者", value: "sender.email" },
        { text: "受信者", value: "partner.email" },
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
    gotoCreate() {
      this.$router.push("/messages/create");
    },
  },
};
</script>
