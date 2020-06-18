<template lang="pug">
  v-col(cols="12")
    .d-flex.justify-end
      v-btn.mr-2(color="primary" fab dark @click="gotoEdit")
        v-icon mdi-pencil
      v-btn(color="error" fab dark @click="deleteResource")
        v-icon mdi-delete
    p.headline イベントステータス詳細
    v-divider
    p 名前: {{ event_status.name }}
</template>

<script>
import ApiRequest from "@/api/base";

export default {
  data() {
    return {
      event_status: {
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
      const request = new ApiRequest("event_statuses", this.$cookie);
      const { response, error } = await request.show(this.event_status.id);
      if (!error) {
        this.event_status.name = response.data.name;
      }
    },
    async deleteResource() {
      const result = confirm("削除してよろしいですか");
      if (!result) return;
      const request = new ApiRequest("event_statuses", this.$cookie);
      const { error } = await request.destroy(this.event_status.id);
      if (!error) {
        this.$router.push("/event_statuses");
      }
    },
    gotoEdit() {
      this.$router.push(`/event_statuses/${this.event_status.id}/edit`);
    },
  },
};
</script>
