<template lang="pug">
  v-col(cols="12")
    ItemTable(:items="items" :headers="headers" btnTitle="新規作成" tableTitle="ユーザーステータス一覧" @rowClicked="gotoShow" @btnClicked="gotoCreate")
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
        { text: "ユーザーステータスID", value: "id" },
        { text: "ユーザーステータス名", value: "name" },
      ],
    };
  },
  async created() {
    const request = new ApiRequest("user_statuses", this.$cookie);
    const { response, error } = await request.index();
    if (!error) {
      this.items = response.data;
    }
  },
  methods: {
    gotoShow(data) {
      this.$router.push(`/user_statuses/${data.id}`);
    },
    gotoCreate() {
      this.$router.push("/user_statuses/create");
    },
  },
};
</script>
