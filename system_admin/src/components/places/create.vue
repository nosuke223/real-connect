<template lang="pug">
  v-col(cols="12")
    PlaceForm(@createResource="createResource" formTitle="店舗作成" btnTitle="作成")      
</template>

<script>
import PlaceForm from "./PlaceForm";
import ApiRequest from "@/api/base";

export default {
  components: {
    PlaceForm,
  },
  methods: {
    async createResource(data) {
      const request = new ApiRequest("places", this.$cookie);
      let requestBody = data;
      const { error } = await request.create(requestBody);
      if (!error) {
        this.$router.push("/places");
      } else {
        if (error.response.data) {
          alert(error.response.data.join("\n"));
        } else {
          alert("保存に失敗しました");
        }
      }
    },
  },
};
</script>
