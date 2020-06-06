<template lang="pug">
  article#pane-dashboard.l-pane.l-pane--full.is-visible
    section.l-pane__body
      .p-scrollable
        // ↓ BEGIN Block Content
        .p-block-content-container
            v-col(cols="12")
              CommonForm(btnTitle="作成" cardTitle="イベントステータス作成" @submit="createResource")
                div(slot="fields")
                  v-text-field(v-model="event_status.name" required :rules="nameRules" )
                
</template>

<script>
import CommonForm from "../utils/commonForm.vue";
import { notNullRule } from "../utils/validation.js";
import ApiRequest from "../../../api/base.js";

export default {
  components: {
    CommonForm,
  },
  data() {
    return {
      event_status: {
        id: this.$route.params.id,
        name: "",
      },
    };
  },
  computed: {
    nameRules() {
      return [(v) => notNullRule(v)];
    },
  },
  methods: {
    async createResource() {
      const request = new ApiRequest("event_statuses", this.$cookie);
      const { response, error } = await request.create(this.event_status);
      if (!error) {
        this.$router.push("/system_admin/event_statuses");
      }
    },
  },
};
</script>
