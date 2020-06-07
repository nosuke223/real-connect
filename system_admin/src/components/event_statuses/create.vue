<template lang="pug">
  v-col(cols="12")
    CommonForm(btnTitle="作成" cardTitle="イベントステータス作成" @submit="createResource")
      div(slot="fields")
        v-text-field(v-model="event_status.name" required :rules="nameRules" )
</template>

<script>
import CommonForm from "../utils/CommonForm";
import { notNullRule } from "@/utils/validation";
import ApiRequest from "@/api/base";

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
      const { error } = await request.create(this.event_status);
      if (!error) {
        this.$router.push("/event_statuses");
      }
    },
  },
};
</script>
