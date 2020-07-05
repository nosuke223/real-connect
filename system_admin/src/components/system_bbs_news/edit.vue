<template lang="pug">
  v-col(cols="12")
    NewsForm(@createResource="updateResource" :id="id" formTitle="お知らせ（news）編集" btnTitle="更新")      
</template>

<script>
import NewsForm from "./NewsForm";
import ApiRequest from "@/api/base";

export default {
  components: {
    NewsForm,
  },
  data() {
    return {
      id: this.$route.params.id,
    };
  },
  methods: {
    async updateResource(data) {
      const request = new ApiRequest("system_bbs_news", this.$cookie);
      let requestBody = data;
      const { error } = await request.update(this.id, requestBody);
      if (!error) {
        this.$router.push("/system_bbs_news");
      } else {
        if (error.response.data) {
          alert(error.response.data.join("\n"));
        } else {
          alert("更新に失敗しました");
        }
      }
    },
  },
};
</script>
