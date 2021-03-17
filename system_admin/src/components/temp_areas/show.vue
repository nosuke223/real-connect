<template lang="pug">
  v-col(cols="12")
    .d-flex.justify-end
      v-btn.mr-2(color="primary" fab dark @click="approval") 承認
      v-btn(color="error" fab dark @click="deleteResource") 却下
    p.headline エリア申請詳細
    v-divider
    div.title
      p 仮エリアID: {{ tempArea.id }}
      p 申請メールアドレス: {{ tempArea.applicationEmail }}
      p 申請コメント: {{ tempArea.applicationComment }}
      p エリア名: {{ tempArea.name }}
      p 〒郵便番号: {{ displayZipCode }}
      p 都道府県: {{ displayPrefecture }}
      p 市区町村: {{ tempArea.municipality }}
</template>

<script>
import ApiRequest from "@/api/base";

export default {
  data() {
    return {
      tempArea: {
        id: this.$route.params.id,
        name: "",
        prefecture: {},
        zipcode: 0,
        applicationComment: "",
        applicationEmail: "",
        municipality: "",
      },
    };
  },
  created() {
    this.fetchResource();
  },
  computed: {
    displayZipCode() {
      if (this.tempArea.zipcode) {
        return this.tempArea.zipcode;
      } else {
        return "";
      }
    },
    displayPrefecture() {
      if (this.tempArea.prefecture) {
        return this.tempArea.prefecture.name;
      } else {
        return "";
      }
    },
  },
  methods: {
    async fetchResource() {
      const request = new ApiRequest("temp_areas", this.$cookie);
      const { response, error } = await request.show(this.tempArea.id);
      if (!error) {
        const data = response.data;
        this.tempArea.name = data.name;
        this.tempArea.prefecture = data.prefecture;
        this.tempArea.zipcode = data.zipcode;
        this.tempArea.applicationComment = data.application_comment;
        this.tempArea.applicationEmail = data.application_email;
        this.tempArea.municipality = data.municipality;
      }
    },
    async deleteResource() {
      const result = confirm("却下してよろしいですか");
      if (!result) return;
      const request = new ApiRequest("temp_areas", this.$cookie);
      const { error } = await request.requestWrapper(
        "delete",
        `temp_areas/${this.tempArea.id}/reject_application`
      );
      if (!error) {
        alert("エリアの申請を却下しました。");
        this.$router.push("/temp_areas");
      }
    },
    async approval() {
      const result = confirm("承認してよろしいですか");
      if (!result) return;
      const request = new ApiRequest("temp_areas", this.$cookie);
      const requestBody = { id: this.tempArea.id };
      const { error } = await request.requestWrapper(
        "post",
        "temp_areas/approval",
        requestBody
      );
      if (!error) {
        alert("エリアの申請を承認しました。");
        this.$router.push("/temp_areas");
      }
    },
  },
};
</script>
