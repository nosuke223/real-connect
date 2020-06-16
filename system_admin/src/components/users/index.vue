<template lang="pug">
  v-col(cols="12")
    ItemTable(:items="items" :headers="headers" btnTitle="新規作成" tableTitle="一般ユーザー一覧" @rowClicked="gotoShow" @btnClicked="gotoCreate")
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
        { text: "ニックネーム", value: "nickname" },
        { text: "地域（エリア)", value: "area.name" },
        { text: "メールアドレス", value: "email" },
      ],
    };
  },
  async created() {
    const request = new ApiRequest("users", this.$cookie);
    const { response, error } = await request.index();
    if (!error) {
      this.items = response.data;
    }
  },
  methods: {
    gotoShow(data) {
      this.$router.push(`/users/${data.id}`);
    },
    gotoCreate() {
      this.$router.push("/users/create");
    },
  },
};
</script>
