<template lang="pug">
  v-col(cols="12")
    ItemTable(:items="items" :headers="headers" tableTitle="店舗一覧" @rowClicked="gotoShow")
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
        { text: "店舗ID", value: "id" },
        { text: "店舗名", value: "name" },
        { text: "郵便番号", value: "zipcode" },
        { text: "都道府県", value: "address1" },
        { text: "オーナー名", value: "owner.full_name" },
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
