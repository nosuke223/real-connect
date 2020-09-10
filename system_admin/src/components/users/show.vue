<template lang="pug">
  v-col(cols="12")
    .d-flex.justify-end
      v-btn(color="error" fab dark @click="deleteResource")
        v-icon mdi-delete
    p.headline ユーザー詳細
    v-divider
    div.title
      v-row
        v-col(xs="12" sm="12" md="6")
          v-avatar(size="84" v-if="user.avatar_image && user.avatar_image.url")
            v-img(:src="user.avatar_image.url")
          p ユーザーID: {{ user.id }}
          p メールアドレス: {{ user.email }}
          p ニックネーム: {{ user.nickname }}
          p フルネーム: {{ user.full_name }}
          p 電話番号: {{ user.telephone }}
          p 性別: {{ user.gender_display }}
          p 年齢: {{ user.age_display }}
        v-col(xs="12" sm="12" md="6")
          v-card(max-width="434" class="mx-auto my-2" tile)
            v-img(:src="user.cover_image.url" max-width="100%" v-if="user.cover_image && user.cover_image.url")
</template>

<script>
import ApiRequest from "@/api/base";

export default {
  data() {
    return {
      user: {
        id: this.$route.params.id,
        email: "",
        nickname: "",
        full_name: "",
        telephone: null,
        gender_display: null,
        age_display: null,
        avatar_image: {},
        logo_image: {}
      },
    };
  },
  created() {
    this.fetchResource();
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
  },
};
</script>
