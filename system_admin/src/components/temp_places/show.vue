<template lang="pug">
  v-col(cols="12")
    .d-flex.justify-end
      v-btn.mr-2(color="primary" fab dark @click="approval") 承認
      v-btn(color="error" fab dark @click="deleteResource") 却下
    p.headline 店舗申請詳細
    v-divider
    div.title
      v-row
        v-col(cols="12")
          p 仮店舗ID: {{ tempPlace.id }}
          p 店舗名: {{ tempPlace.name }}
          p 電話番号: {{ tempPlace.telephone }}
          p 郵便番号: {{ tempPlace.zipcode }}
          p 住所: {{ displayAddress }}
          p エリア: {{ displayArea }}
          p 申請コメント: {{ tempPlace.application_comment }}
          p 申請メールアドレス: {{ tempPlace.application_email }}
</template>

<script>
import ApiRequest from "@/api/base";
import ItemTable from "../utils/ItemTable";

export default {
  components: {
    ItemTable,
  },
  data() {
    return {
      tempPlace: {
        id: this.$route.params.id,
        name: "",
        telephone: null,
        url: "",
        description: "",
        note: "",
        address1: "",
        address2: "",
        address3: "",
        zipcode: 0,
        application_email: "",
        area: {},
      },
    };
  },
  created() {
    this.fetchResource();
  },
  computed: {
    displayAddress() {
      const addressArray = [
        this.tempPlace.address1,
        this.tempPlace.address2,
        this.tempPlace.address3,
      ].filter((v) => v);
      return addressArray.join("");
    },
    displayArea() {
      if (this.tempPlace.area && this.tempPlace.area.name) {
        return this.tempPlace.area.name;
      } else {
        return "";
      }
    },
  },
  methods: {
    async fetchResource() {
      const request = new ApiRequest("temp_places", this.$cookie);
      const { response, error } = await request.show(this.tempPlace.id);
      if (!error) {
        const data = response.data;
        this.tempPlace = data;
      }
    },
    async deleteResource() {
      const result = confirm("却下してよろしいですか");
      if (!result) return;
      const request = new ApiRequest("temp_places", this.$cookie);
      const { error } = await request.requestWrapper(
        "delete",
        `temp_places/${this.tempPlace.id}/reject_application`
      );
      if (!error) {
        this.$router.push("/temp_places");
      }
    },
    async approval() {
      const result = confirm("承認してよろしいですか");
      if (!result) return;
      const request = new ApiRequest("temp_places", this.$cookie);
      const requestBody = { id: this.tempPlace.id };
      const { error } = await request.requestWrapper(
        "post",
        "temp_places/approval",
        requestBody
      );
      if (!error) {
        this.$router.push("/temp_places");
      }
    },
  },
};
</script>
