<template lang="pug">
  v-col(cols="12")
    PlaceForm(@createResource="createResource" formTitle="店舗申請フォーム" btnTitle="申請")      
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
      const request = new ApiRequest("temp_places", this.$cookie);
      let requestBody = data;
      requestBody.address1 = data.address1.text;
      const { error } = await request.create(requestBody);
      if (!error) {
        alert("申請が完了しました。");
        location.reload();
      } else {
        if (error.response.data) {
          alert(error.response.data.join("\n"));
        } else {
          alert("申請に失敗しました");
        }
      }
    },
  },
};
</script>
