<template lang="pug">
  v-col(cols="12")
    ItemTable(:items="items" :headers="headers" tableTitle="エリア一覧" @rowClicked="gotoShow" )
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
        { text: "エリアID", value: "id" },
        { text: "エリア名", value: "name" },
        { text: "郵便番号", value: "zipcode" },
        { text: "都道府県", value: "prefecture.name" },
      ],
    };
  },
  async created() {
    const request = new ApiRequest("areas", this.$cookie);
    const { response, error } = await request.index();
    if (!error) {
      this.items = response.data;
    }
  },
  methods: {
    gotoShow(data) {
      this.$router.push(`/areas/${data.id}`);
    },
    gotoCreate() {
      this.$router.push("/areas/create");
    },
  },
};
</script>
