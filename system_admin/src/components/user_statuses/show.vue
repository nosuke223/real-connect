<template lang="pug">
  v-col(cols="12")
    .d-flex.justify-end
      v-btn.mr-2(color="primary" fab dark @click="gotoEdit")
        v-icon mdi-pencil
      v-btn(color="error" fab dark @click="deleteResource")
        v-icon mdi-delete
    p.headline ユーザーステータス詳細
    v-divider
    p ユーザーステータスID: {{ user_status.id }}
    p ユーザーステータス名: {{ user_status.name }}
</template>

<script>
import ApiRequest from "@/api/base";

export default {
  data() {
    return {
      user_status: {
        id: this.$route.params.id,
        name: "",
      },
    };
  },
  created() {
    this.fetchResource();
  },
  methods: {
    async fetchResource() {
      const request = new ApiRequest("user_statuses", this.$cookie);
      const { response, error } = await request.show(this.user_status.id);
      if (!error) {
        this.user_status.name = response.data.name;
      }
    },
    async deleteResource() {
      const result = confirm("削除してよろしいですか");
      if (!result) return;
      const request = new ApiRequest("user_statuses", this.$cookie);
      const { error } = await request.destroy(this.user_status.id);
      if (!error) {
        this.$router.push("/user_statuses");
      }
    },
    gotoEdit() {
      this.$router.push(`/user_statuses/${this.user_status.id}/edit`);
    },
  },
};
</script>
