<template lang="pug">
  article#pane-dashboard.l-pane.l-pane--full.is-visible
    section.l-pane__body
      .p-scrollable
        // ↓ BEGIN Block Content
        .p-block-content-container
          v-col(cols="12")
            .d-flex.justify-end
              v-btn.mr-2(text color="primary" dark @click="gotoEdit") 編集
              v-btn(text color="error" dark @click="deleteResource") 削除
            p 名前: {{ event_status.name }}
                
</template>

<script>
import ApiRequest from "../../../api/base.js";

export default {
  data() {
    return {
      event_status: {
        id: this.$route.params.id,
        name: "",
      },
    };
  },
  mounted() {
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
      const { response, error } = await request.destroy(this.event_status.id);
      if (!error) {
        this.$router.push("/system_admin/event_statuses");
      }
    },
    gotoEdit() {
      this.$router.push(
        `/system_admin/event_statuses/edit/${this.event_status.id}`
      );
    },
  },
};
</script>
