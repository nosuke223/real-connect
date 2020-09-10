<template lang="pug">
  v-col(cols="12")
    ItemTable(:items="items" :headers="headers" tableTitle="エリア申請一覧" @rowClicked="gotoShow")
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
        { text: "仮エリアID", value: "id" },
        { text: "エリア名", value: "name" },
        { text: "申請コメント", value: "application_comment" },
        { text: "申請メールアドレス", value: "application_email" },
        { text: "都道府県", value: "prefecture.name" },
      ],
    };
  },
  async created() {
    const request = new ApiRequest("temp_areas", this.$cookie);
    const { response, error } = await request.index();
    if (!error) {
      this.items = response.data;
    }
  },
  methods: {
    gotoShow(data) {
      this.$router.push(`/temp_areas/${data.id}`);
    },
  },
};
</script>
