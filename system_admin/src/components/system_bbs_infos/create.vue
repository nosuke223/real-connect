<template lang="pug">
  v-col(cols="12")
    InfoForm(@createResource="createResource" formTitle="お知らせ(info)作成" btnTitle="作成")      
</template>

<script>
import InfoForm from "./InfoForm";
import ApiRequest from "@/api/base";

export default {
  components: {
    InfoForm,
  },
  methods: {
    async createResource(data) {
      const request = new ApiRequest("system_bbs_infos", this.$cookie);
      let requestBody = data;
      const { error } = await request.create(requestBody);
      if (!error) {
        this.$router.push("/system_bbs_infos");
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
