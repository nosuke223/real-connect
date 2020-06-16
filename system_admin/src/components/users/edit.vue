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
        this.formProps = response.data;
      }
    },
    async updateResource() {
      const request = new ApiRequest("users", this.$cookie);
      const requestBody = this.formProps;
      requestBody.role = "user";
      const { error } = await request.update(this.id, requestBody);
      if (!error) {
        this.$router.push("/users");
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
