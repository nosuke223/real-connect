<template lang="pug">
  v-col(cols="12")
    .d-flex.justify-end
      v-btn.mr-2(color="primary" fab dark @click="gotoEdit")
        v-icon mdi-pencil
      v-btn(color="error" fab dark @click="deleteResource")
        v-icon mdi-delete
    p.headline イベント詳細
    v-divider
    div.title
      v-row
        v-col(xs="12" sm="12" md="6")
          p メッセージ内容:
          p {{message.body}}
          p イベント名:{{displayEventName}}
          p 作成日時:{{message.createdAt}}
          p 更新日時:{{message.updatedAt}}
          p 送信者:{{displaySender}}
          p 受信者:{{displayPartner}}
        v-col(xs="12" sm="12" md="6")
          v-img(:src="message.image" v-if="message.image")

</template>

<script>
import ApiRequest from "@/api/base";
import { formatDateTime } from "@/utils/format_date";

export default {
  data() {
    return {
      message: {
        id: this.$route.params.id,
        body: "",
        image: "",
        createdAt: "",
        updatedAt: "",
        event: {},
        sender: {},
        partner: {},
      },
    };
  },
  created() {
    this.fetchResource();
  },
  computed: {
    displaySender() {
      if (this.message.sender) {
        return this.message.sender.email;
      } else {
        return "";
      }
    },
    displayPartner() {
      if (this.message.partner) {
        return this.message.partner.email;
      } else {
        return "";
      }
    },
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
        this.message.createdAt = formatDateTime(data.created_at);
        this.message.updatedAt = formatDateTime(data.updated_at);
        this.message.event = data.event;
        this.message.sender = data.sender;
        this.message.partner = data.partner;
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
    },
    gotoEdit() {
      this.$router.push(`/messages/${this.message.id}/edit`);
    },
  },
};
</script>
