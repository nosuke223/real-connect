<template lang="pug">
  v-col(cols="12")
    MessageForm(@createResource="updateResource" :id="id" formTitle="メッセージ編集" btnTitle="更新")      
</template>

<script>
import MessageForm from "./MessageForm";
import ApiRequest from "@/api/base";

export default {
  components: {
    MessageForm,
  },
  data() {
    return {
      id: this.$route.params.id,
    };
  },
  methods: {
    async updateResource(data) {
      const request = new ApiRequest("messages", this.$cookie);
      let requestBody = data;
      const { error } = await request.update(this.id, requestBody);
      if (!error) {
        this.$router.push("/messages");
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
