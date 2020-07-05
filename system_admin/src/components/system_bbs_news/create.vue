<template lang="pug">
  v-col(cols="12")
    NewsForm(@createResource="createResource" formTitle="お知らせ(news)作成" btnTitle="作成")      
</template>

<script>
import NewsForm from "./NewsForm";
import ApiRequest from "@/api/base";

export default {
  components: {
    NewsForm,
  },
  methods: {
    async createResource(data) {
      const request = new ApiRequest("system_bbs_news", this.$cookie);
      let requestBody = data;
      const { error } = await request.create(requestBody);
      if (!error) {
        this.$router.push("/system_bbs_news");
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
