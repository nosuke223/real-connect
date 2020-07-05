<template lang="pug">
  v-col(cols="12")
    InfoForm(@createResource="updateResource" :id="id" formTitle="お知らせ（info）編集" btnTitle="更新")      
</template>

<script>
import InfoForm from "./InfoForm";
import ApiRequest from "@/api/base";

export default {
  components: {
    InfoForm,
  },
  data() {
    return {
      id: this.$route.params.id,
    };
  },
  methods: {
    async updateResource(data) {
      const request = new ApiRequest("system_bbs_infos", this.$cookie);
      let requestBody = data;
      const { error } = await request.update(this.id, requestBody);
      if (!error) {
        this.$router.push("/system_bbs_infos");
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
