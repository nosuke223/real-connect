<template lang="pug">
  v-col(cols="12")
    AreaForm(@createResource="createResource" formTitle="エリア申請フォーム" btnTitle="申請")      
</template>

<script>
import AreaForm from "./AreaForm";
import ApiRequest from "@/api/base";

export default {
  components: {
    AreaForm,
  },
  methods: {
    async createResource(data) {
      const request = new ApiRequest("temp_areas", this.$cookie);
      let requestBody = data;
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
