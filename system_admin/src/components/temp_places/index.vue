<template lang="pug">
  v-col(cols="12")
    ItemTable(:items="items" :headers="headers" tableTitle="店舗申請一覧" @rowClicked="gotoShow")
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
        { text: "申請者メールアドレス", value: "application_email" },
      ],
    };
  },
  async created() {
    const request = new ApiRequest("temp_places", this.$cookie);
    const { response, error } = await request.index();
    if (!error) {
      this.items = response.data;
    }
  },
  methods: {
    gotoShow(data) {
      this.$router.push(`/temp_places/${data.id}`);
    },
  },
};
</script>
