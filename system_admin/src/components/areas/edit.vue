<template lang="pug">
  v-col(cols="12")
    CommonForm(btnTitle="更新" cardTitle="エリア修正" @submit="updateResource")
      div(slot="fields")
        v-text-field(v-model="area.name" required :rules="nameRules" label="エリア名" )
        v-select(v-model="area.prefecture" item-text="name" item-value="code" :items="prefectures" label="都道府県" clearable )
        v-text-field(type="postal-code" v-model="area.zipcode" label="〒郵便番号" :rules="zipCodeRules" )
</template>

<script>
import CommonForm from "../utils/CommonForm";
import { notNullRule, zipCodeRule } from "@/utils/validation";
import ApiRequest from "@/api/base";

export default {
  components: {
    CommonForm,
  },
  data() {
    return {
      area: {
        id: this.$route.params.id,
        name: "",
        zipcode: "",
        prefecture: "",
      },
      prefectures: [],
    };
  },
  computed: {
    nameRules() {
      return [(v) => notNullRule(v)];
    },
    zipCodeRules() {
      return [(v) => zipCodeRule(v)];
    },
  },
  mounted() {
    this.fetchPrefectures();
    this.fetchResource();
  },
  methods: {
    async fetchResource() {
      const request = new ApiRequest("areas", this.$cookie);
      const { response, error } = await request.show(this.area.id);
      if (!error) {
        this.area.name = response.data.name;
        this.area.zipcode = response.data.zipcode;
        if (response.data.prefecture) {
          this.area.prefecture = String(response.data.prefecture.id);
        }
      }
    },
    async fetchPrefectures() {
      const request = new ApiRequest("prefectures", this.$cookie);
      const { response, error } = await request.index();
      if (!error) {
        this.prefectures = response.data;
      }
    },
    async updateResource() {
      const request = new ApiRequest("areas", this.$cookie);
      const requestBody = {
        area: {
          name: this.area.name,
          zipcode: this.area.zipcode,
          prefecture_id: Number(this.area.prefecture),
        },
      };
      const { error } = await request.update(this.area.id, requestBody);
      if (!error) {
        this.$router.push("/areas");
      }
    },
  },
};
</script>
