<template lang="pug">
  v-col(cols="12")
    UserForm(v-bind="formProps" @updateValue="updateValue" @createResource="updateResource")
      
</template>

<script>
import UserForm from "./UserForm";
import ApiRequest from "@/api/base";

export default {
  components: {
    UserForm,
  },
  data() {
    return {
      formProps: {
        email: "",
        password: "",
        nickname: "",
        full_name: "",
        telephone: "",
      },
      id: this.$route.params.id,
    };
  },
  created() {
    this.fetchResource();
  },
  methods: {
    async fetchResource() {
      const request = new ApiRequest("users", this.$cookie);
      const { response, error } = await request.show(this.id);
      if (!error) {
        const data = response.data;
        this.formProps.email = data.email;
        this.formProps.nickname = data.nickname;
        this.formProps.full_name = data.full_name;
        this.formProps.telephone = data.telephone;
      }
    },
    async updateResource() {
      const request = new ApiRequest("users", this.$cookie);
      let requestBody = this.formProps;
      requestBody.role = "owner";
      const { error } = await request.update(this.id, requestBody);
      if (!error) {
        this.$router.push("/owners");
      } else {
        alert("更新に失敗しました");
      }
    },
    updateValue(type, value) {
      this.formProps[type] = value;
    },
  },
};
</script>
