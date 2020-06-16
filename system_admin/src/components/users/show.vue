<template lang="pug">
  v-col(cols="12")
    .d-flex.justify-end
      v-btn.mr-2(color="primary" fab dark @click="gotoEdit")
        v-icon mdi-pencil
      v-btn(color="error" fab dark @click="deleteResource")
        v-icon mdi-delete
    p.headline ユーザー詳細
    v-divider
    div.title
      v-row
        v-col(xs="12" sm="12" md="6")
          p メールアドレス: {{ user.email }}
          p ニックネーム: {{ user.nickname }}
          p フルネーム: {{ user.full_name }}
          p 電話番号: {{ user.telephone }}
          p エリア: {{ displayArea }}
          p 都道府県: {{ displayPrefecture }}
          p 性別: {{ user.gender_display }}
          p 身長: {{ user.height }}
          p 年齢: {{ user.age_display }}
        v-col(xs="12" sm="12" md="6")
          p 血液型: {{ user.blood_display }}
          p 収入: {{ user.income_display }}
          p 最終学歴: {{ user.education_display }}
          p 職業: {{ user.business }}
          p タバコ: {{ displayTobaco }}
          p お酒: {{ displayAlcohol }}
          p 出身地: {{ user.birthplace }}
          p 趣味: {{ user.hobbies }}
          p 好きな異性のタイプ: {{ user.attracted_type }}
          p ファッション: {{ user.fashion }}


</template>

<script>
import ApiRequest from "@/api/base";

export default {
  data() {
    return {
      user: {
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
    displayTobaco() {
      if (this.user.tobacco) {
        return "吸う";
      } else {
        return "吸わない";
      }
    },
    displayAlcohol() {
      if (this.user.alcohol) {
        return "飲む";
      } else {
        return "飲まない";
      }
    },
    displayArea() {
      if (this.user.area) {
        return this.user.area.name;
      } else {
        return "";
      }
    },
    displayPrefecture() {
      if (this.user.prefecture) {
        return this.user.prefecture.name;
      } else {
        return "";
      }
    },
  },
  methods: {
    async fetchResource() {
      const request = new ApiRequest("users", this.$cookie);
      const { response, error } = await request.show(this.user.id);
      if (!error) {
        this.user = response.data;
      }
    },
    async deleteResource() {
      const result = confirm("削除してよろしいですか");
      if (!result) return;
      const request = new ApiRequest("users", this.$cookie);
      const { error } = await request.destroy(this.user.id);
      if (!error) {
        this.$router.push("/users");
      }
    },
    gotoEdit() {
      this.$router.push(`/users/${this.user.id}/edit`);
    },
  },
};
</script>
