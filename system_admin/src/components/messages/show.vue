<template lang="pug">
  v-col(cols="12")
    .d-flex.justify-end
      v-btn(color="error" fab dark @click="deleteResource")
        v-icon mdi-delete
    p.headline メッセージ詳細
    v-divider
    div.title
      v-row
        v-col(cols="12")
          p メッセージID: {{message.id}}
          p メッセージ内容:
          p {{message.body}}
          p イベント名:{{displayEventName}}
          p 送信者:{{message.sender_nickname}}
          p パートナー名:{{message.partner_nickname}}

</template>

<script>
import ApiRequest from "@/api/base";

export default {
  data() {
    return {
      message: {
        id: this.$route.params.id,
        body: "",
        image: "",
        event: {},
      },
    };
  },
  created() {
    this.fetchResource();
  },
  computed: {
    displayEventName() {
      if (this.message.event) {
        return this.message.event.name;
      } else {
        return "";
      }
    },
  },
  methods: {
    async fetchResource() {
      const request = new ApiRequest("messages", this.$cookie);
      const { response, error } = await request.show(this.message.id);
      if (!error) {
        const data = response.data;
        this.message.body = data.body;
        this.message.image = data.image;
        this.message.event = data.event;
        this.message.sender_nickname = data.sender_nickname;
        this.message.partner_nickname = data.partner_nickname;
      }
    },
    async deleteResource() {
      const result = confirm("削除してよろしいですか");
      if (!result) return;
      const request = new ApiRequest("messages", this.$cookie);
      const { error } = await request.destroy(this.message.id);
      if (!error) {
        this.$router.push("/messages");
      }
    }
  },
};
</script>
