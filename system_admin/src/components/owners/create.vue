<template lang="pug">
  v-col(cols="12")
    UserForm(v-bind="formProps" @updateValue="updateValue" @createResource="createResource")
      
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
  methods: {
    async createResource() {
      const request = new ApiRequest("users", this.$cookie);
      let requestBody = this.formProps;
      requestBody.role = "owner";
      const { error } = await request.create(requestBody);
      if (!error) {
        this.$router.push("/owners");
      } else {
        alert("保存に失敗しました");
      }
    },
    updateValue(type, value) {
      this.formProps[type] = value;
    },
  },
};
</script>
