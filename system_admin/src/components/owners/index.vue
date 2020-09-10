<template lang="pug">
  v-col(cols="12")
    ItemTable(:items="items" :headers="headers" tableTitle="店舗ユーザー一覧" @rowClicked="gotoShow")
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
        { text: "ユーザーID", value: "id" },
        { text: "メールアドレス", value: "email" },
        { text: "ニックネーム", value: "nickname" },
        { text: "フルネーム", value: "full_name" },
      ],
    };
  },
  async created() {
    const request = new ApiRequest("users?role=owner", this.$cookie);
    const { response, error } = await request.index();
    if (!error) {
      const data = response.data;
      this.items = data;
    }
  },
  methods: {
    gotoShow(data) {
      this.$router.push(`/owners/${data.id}`);
    }
  },
};
</script>
