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
          p 名前:{{event.name}}
          p エリア名:{{displayAreaName}}
          p 詳細:{{event.detail}}
          p 参加可能人数:{{event.capacity}}
          p 男性参加者:{{event.male}}人
          p 女性参加者:{{event.female}}人
          p チェックインコード:{{event.checkInCode}}
          p 開始日:{{event.startTime}}
          p 終了日:{{event.endTime}}
          p ステータス:{{displayEventStatusName}}
        v-col(xs="12" sm="12" md="6")
          p 参加したユーザー
          ul(v-if="event.users")
            div(v-for="user in event.users" :key="user.id")
              router-link(:to="'/users/' + user.id")
                li {{user.nickname}}
</template>

<script>
import ApiRequest from "@/api/base";
import { formatDateTime } from "@/utils/format_date";
import { countParticipant } from "@/utils/event";

export default {
  data() {
    return {
      event: {
        id: this.$route.params.id,
        name: "",
        area: {},
        checkInCode: "",
        startTime: "",
        endTime: "",
        eventStatus: {},
        detail: "",
        capacity: "",
        users: [],
        male: 0,
        female: 0,
      },
    };
  },
  created() {
    this.fetchResource();
  },
  computed: {
    displayAreaName() {
      if (this.event.area) {
        return this.event.area.name;
      } else {
        return "";
      }
    },
    displayEventStatusName() {
      if (this.event.eventStatus) {
        return this.event.eventStatus.name;
      } else {
        return "";
      }
    },
  },
  methods: {
    async fetchResource() {
      const request = new ApiRequest("events", this.$cookie);
      const { response, error } = await request.show(this.event.id);
      if (!error) {
        const data = response.data;
        this.event.name = data.name;
        this.event.area = data.area;
        this.event.checkInCode = data.check_in_code;
        this.event.startTime = formatDateTime(data.start_time);
        this.event.endTime = formatDateTime(data.end_time);
        this.event.eventStatus = data.event_status;
        this.event.detail = data.detail;
        this.event.organizerName = data.organizer_name;
        this.event.capacity = data.capacity;
        this.event.users = data.users;
        const { male, female } = countParticipant(data.users);
        [this.event.male, this.event.female] = [male, female];
      }
    },
    async deleteResource() {
      const result = confirm("削除してよろしいですか");
      if (!result) return;
      const request = new ApiRequest("events", this.$cookie);
      const { error } = await request.destroy(this.event.id);
      if (!error) {
        this.$router.push("/events");
      }
    },
    gotoEdit() {
      this.$router.push(`/events/${this.event.id}/edit`);
    },
  },
};
</script>
