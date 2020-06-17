<template lang="pug">
  v-col(cols="12")
    ItemTable(:items="items" :headers="headers" btnTitle="新規作成" tableTitle="店舗ユーザー一覧" @rowClicked="gotoShow" @btnClicked="gotoCreate")
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
        { text: "店舗", value: "own_places[0].name" },
        { text: "メールアドレス", value: "email" },
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
    },
    gotoCreate() {
      this.$router.push("/owners/create");
    },
  },
};
</script>
