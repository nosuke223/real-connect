<template lang="pug">
    v-col(cols="12")
      v-card.mx-auto(max-width="600px")
        v-container.overflow-y-auto(style="max-height: 600px")
          v-card-title.headline {{this.event.name}}
          v-card-subtitle トーク
          div(v-for="message in event.messages" :key="message.id" v-if="message")
            v-card-subtitle
              span ニックネーム：
              span.green--text.font-weight-bold {{message.sender_nickname}}
              span.ml-1 :{{message.created_at}}
            v-card-text {{message.body}}
            v-divider
        div(v-if="event.messages && event.messages.length === 0")
          v-card-text.text-h6 まだトークが投稿されていません
        v-card-actions
          v-btn(color="secondary" outlined @click="goBack") 戻る
</template>

<script>
import ApiRequest from "@/api/base";
import { formatDateTime } from "@/utils/format_date";

export default {
  data() {
    return {
      event: {},
      id: this.$route.params.id
    };
  },
  async created() {
    const request = new ApiRequest("messages", this.$cookie);
    const { response, error } = await request.requestWrapper(
      "get",
      `events/${this.id}/detail_with_messages`
    );
    if (!error) {
      let messages = [];
      if (response.data.messages) {
        messages = response.data.messages.map(record => {
          record.created_at = formatDateTime(record.created_at);
          return record;
        });
      } else {
        messages = [];
      }
      this.event = response.data;
      this.event.messages = messages;
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
