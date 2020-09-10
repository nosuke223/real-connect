<template lang="pug">
  v-col(cols="12")
    ItemTable(:items="items" :headers="headers" tableTitle="一般ユーザー一覧" @rowClicked="gotoShow")
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
    const request = new ApiRequest("users?role=user", this.$cookie);
    const { response, error } = await request.index({
      role: "user",
    });
    if (!error) {
      this.items = response.data;
    }
  },
  methods: {
    gotoShow(data) {
      this.$router.push(`/users/${data.id}`);
    }
  },
};
</script>
