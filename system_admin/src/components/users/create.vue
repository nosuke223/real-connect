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
        height: 150,
        prefecture_id: 0,
        area_id: 0,
        gender: "",
        age: "",
        blood: "",
        income: "",
        education: "",
        business: "",
        birthplace: "",
        attracted_type: "",
        hobbies: "",
        fashion: "",
        tobacco: false,
        alcohol: false,
      },
      prefectures: [],
    };
  },
  methods: {
    async createResource() {
      const request = new ApiRequest("users", this.$cookie);
      const requestBody = this.formProps;
      requestBody.role = "user";
      const { error } = await request.create(requestBody);
      if (!error) {
        this.$router.push("/users");
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
