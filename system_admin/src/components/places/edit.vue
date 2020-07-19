<template lang="pug">
  v-col(cols="12")
    PlaceForm(@createResource="updateResource" :id="id" formTitle="店舗編集" btnTitle="更新")      
</template>

<script>
import PlaceForm from "./PlaceForm";
import ApiRequest from "@/api/base";

export default {
  components: {
    PlaceForm,
  },
  data() {
    return {
      id: this.$route.params.id,
    };
  },
  methods: {
    async updateResource(data) {
      const request = new ApiRequest("places", this.$cookie);
      let requestBody = data;
      const { error } = await request.update(this.id, requestBody);
      if (!error) {
        this.$router.push("/places");
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
