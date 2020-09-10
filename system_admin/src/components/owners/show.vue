<template lang="pug">
  v-col(cols="12")
    .d-flex.justify-end
      v-btn(color="error" fab dark @click="deleteResource")
        v-icon mdi-delete
    p.headline 店舗ユーザー詳細
    v-divider
    div.title
      v-row
        v-col(cols="12")
          p メールアドレス: {{ owner.email }}
          p ニックネーム: {{ owner.nickname }}
          p フルネーム: {{ owner.fullName }}
          p 電話番号: {{ owner.telephone }}
          p 店舗: {{ displayOwnPlaces }}
</template>

<script>
import ApiRequest from "@/api/base";

export default {
  data() {
    return {
      owner: {
        id: this.$route.params.id,
        email: "",
        nickname: "",
        fullName: "",
        telephone: "",
        ownPlaces: [],
      },
    };
  },
  created() {
    this.fetchResource();
  },
  computed: {
    displayOwnPlaces() {
      if (this.owner.ownPlaces) {
        let placeNames = this.owner.ownPlaces.map((ownPlace) => {
          return ownPlace.name;
        });
        return placeNames.join(",");
      } else {
        return "";
      }
    },
  },
  methods: {
    async fetchResource() {
      const request = new ApiRequest("users", this.$cookie);
      const { response, error } = await request.show(this.owner.id);
      if (!error) {
        const data = response.data;
        this.owner.email = data.email;
        this.owner.nickname = data.nickname;
        this.owner.fullName = data.full_name;
        this.owner.telephone = data.telephone;
        this.owner.ownPlaces = data.own_places;
      }
    },
    async deleteResource() {
      const result = confirm("削除してよろしいですか");
      if (!result) return;
      const request = new ApiRequest("users", this.$cookie);
      const { error } = await request.destroy(this.owner.id);
      if (!error) {
        this.$router.push("/owners");
      }
    },
  },
};
</script>
