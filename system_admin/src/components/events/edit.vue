<template lang="pug">
  v-col(cols="12")
    EventForm(@createResource="updateResource" :id="id" formTitle="イベント編集" btnTitle="更新")      
</template>

<script>
import EventForm from "./EventForm";
import ApiRequest from "@/api/base";

export default {
  components: {
    EventForm,
  },
  data() {
    return {
      id: this.$route.params.id,
    };
  },
  methods: {
    async updateResource(data) {
      const request = new ApiRequest("events", this.$cookie);
      let requestBody = data;
      const { error } = await request.update(this.id, requestBody);
      if (!error) {
        this.$router.push("/events");
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
