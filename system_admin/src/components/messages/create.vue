<template lang="pug">
  v-col(cols="12")
    MessageForm(@createResource="createResource" formTitle="メッセージ作成" btnTitle="作成")      
</template>

<script>
import MessageForm from "./MessageForm";
import ApiRequest from "@/api/base";

export default {
  components: {
    MessageForm,
  },
  methods: {
    async createResource(data) {
      const request = new ApiRequest("messages", this.$cookie);
      let requestBody = data;
      const { error } = await request.create(requestBody);
      if (!error) {
        this.$router.push("/messages");
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
