<template lang="pug">
  v-col(cols="12")
    ItemTable(:items="items" :headers="headers" tableTitle="店舗一覧" @rowClicked="gotoShow" btnTitle="新規作成" @btnClicked="gotoCreate")
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
        { text: "管理者メールアドレス", value: "owner.email" },
      ],
    };
  },
  async created() {
    const request = new ApiRequest("places", this.$cookie);
    const { response, error } = await request.index();
    if (!error) {
      this.items = response.data;
    }
  },
  methods: {
    gotoShow(data) {
      this.$router.push(`/places/${data.id}`);
    },
    gotoCreate() {
      this.$router.push("/places/create");
    },
  },
};
</script>
