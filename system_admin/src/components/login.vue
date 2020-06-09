<template lang="pug">
  v-col(cols="12")
    CommonForm(btnTitle="ログイン" cardTitle="システム管理者ログイン" @submit="requestLogin")
      div(slot="fields")
        v-text-field(v-model="email" required :rules="emailRules" label="email" )
        v-text-field(type="password" v-model="password" required :rules="nameRules" label="password" )     
</template>

<script>
import CommonForm from "@/components/utils/CommonForm";
import { notNullRule, emailFormatRule } from "@/utils/validation";
import ApiRequest from "@/api/base";

export default {
  components: {
    CommonForm,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    nameRules() {
      return [(v) => notNullRule(v)];
    },
    emailRules() {
      return [(v) => emailFormatRule(v)];
    },
  },
  methods: {
    async requestLogin() {
      const request = new ApiRequest("sessions");
      const body = {
        email: this.email,
        password: this.password,
      };
      const { response, error } = await request.create(body);
      if (!error) {
        this.$cookie.set("Authorization", response.headers.authorization, {
          expires: "1M",
        });
        this.$router.push("/");
      }
    },
  },
};
</script>
