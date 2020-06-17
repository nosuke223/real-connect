<template lang="pug">
  v-col(cols="12")
    CommonForm(btnTitle="更新" cardTitle="ユーザーステータス修正" @submit="updateResource")
      div(slot="fields")
        v-text-field(v-model="user_status.name" required :rules="nameRules" )
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
      user_status: {
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
    async updateResource() {
      const request = new ApiRequest("user_statuses", this.$cookie);
      const { error } = await request.update(
        this.user_status.id,
        this.user_status
      );
      if (!error) {
        this.$router.push("/user_statuses");
      }
    },
  },
};
</script>
