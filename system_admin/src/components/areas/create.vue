<template lang="pug">
  v-col(cols="12")
    CommonForm(btnTitle="作成" cardTitle="エリア作成" @submit="createResource" @cancel="cancel")
      div(slot="fields")
        v-text-field(v-model="area.name" required :rules="nameRules" label="エリア名" )
        v-text-field(type="postal-code" v-model="area.zipcode" label="〒郵便番号" :rules="zipCodeRules" )
        v-select(v-model="area.prefecture" item-text="name" item-value="code" :items="prefectures" label="都道府県" clearable )
        v-text-field(v-model="area.municipality" required :rules="nameRules" label="市区町村" )
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
        municipality: "",
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
  created() {
    this.fetchPrefectures();
  },
  methods: {
    async fetchPrefectures() {
      const request = new ApiRequest("prefectures", this.$cookie);
      const { response, error } = await request.index();
      if (!error) {
        this.prefectures = response.data;
      }
    },
    async createResource() {
      const request = new ApiRequest("areas", this.$cookie);
      const requestBody = {
        area: {
          name: this.area.name,
          zipcode: this.area.zipcode,
          municipality: this.area.municipality,
          prefecture_id: Number(this.area.prefecture),
        },
      };
      const { error } = await request.create(requestBody);
      if (!error) {
        this.$router.push("/areas");
      } else {
        if (error.response.data) {
          alert(error.response.data.join("\n"));
        } else {
          alert("保存に失敗しました");
        }
      }
    },
    cancel() {
      this.$router.push(`/areas`);
    },
  },
};
</script>
