<template lang="pug">
  v-col(cols="12")
    .d-flex.justify-end
      v-btn.mr-2(color="primary" fab dark @click="gotoEdit")
        v-icon mdi-pencil
      v-btn(color="error" fab dark @click="deleteResource")
        v-icon mdi-delete
    p.headline エリア詳細
    v-divider
    div.title
      p エリアID: {{ area.id }}
      p エリア名: {{ area.name }}
      p 都道府県: {{ displayPrefecture }}
      p 〒郵便番号: {{ displayZipCode }}
</template>

<script>
import ApiRequest from "@/api/base";

export default {
  data() {
    return {
      area: {
        id: this.$route.params.id,
        name: "",
        prefecture: {},
        zipcode: 0,
      },
    };
  },
  created() {
    this.fetchResource();
  },
  computed: {
    displayZipCode() {
      if (this.area.zipcode) {
        return this.area.zipcode;
      } else {
        return "";
      }
    },
    displayPrefecture() {
      if (this.area.prefecture) {
        return this.area.prefecture.name;
      } else {
        return "";
      }
    },
  },
  methods: {
    async fetchResource() {
      const request = new ApiRequest("areas", this.$cookie);
      const { response, error } = await request.show(this.area.id);
      if (!error) {
        this.area = response.data;
      }
    },
    async deleteResource() {
      const result = confirm("削除してよろしいですか");
      if (!result) return;
      const request = new ApiRequest("areas", this.$cookie);
      const { error } = await request.destroy(this.area.id);
      if (!error) {
        this.$router.push("/areas");
      }
    },
    gotoEdit() {
      this.$router.push(`/areas/${this.area.id}/edit`);
    },
  },
};
</script>
