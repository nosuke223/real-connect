<template lang="pug">
  v-col(cols="12")
    CommonForm(btnTitle="作成" cardTitle="ユーザーステータス作成" @submit="createResource")
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
  methods: {
    async createResource() {
      const request = new ApiRequest("user_statuses", this.$cookie);
      const { error } = await request.create(this.user_status);
      if (!error) {
        this.$router.push("/user_statuses");
      }
    },
  },
};
</script>
