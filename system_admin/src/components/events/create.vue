<template lang="pug">
  v-col(cols="12")
    EventForm(@createResource="createResource" formTitle="イベント作成" btnTitle="作成")      
</template>

<script>
import EventForm from "./EventForm";
import ApiRequest from "@/api/base";

export default {
  components: {
    EventForm,
  },
  methods: {
    async createResource(data) {
      const request = new ApiRequest("events", this.$cookie);
      let requestBody = data;
      const { error } = await request.create(requestBody);
      if (!error) {
        this.$router.push("/events");
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
