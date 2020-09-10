<template lang="pug">
  v-col(cols="12")
    .d-flex.justify-end
      v-btn.mr-2(color="primary" fab dark @click="gotoEdit" v-if="isAdminCreate")
        v-icon mdi-pencil
      v-btn(color="error" fab dark @click="deleteResource")
        v-icon mdi-delete
    p.headline イベント詳細
    v-divider
    div.title
      v-row
        v-col(cols="12")
          p イベントID:{{event.id}}
          p 名前:{{event.name}}
          p イベント詳細:{{event.detail}}
          p 募集人数:{{event.capacity}}
          p エリア名:{{displayAreaName}}
          p 開始日:{{event.startTime}}
          p 終了日:{{event.endTime}}
          p 主催者種別:{{displayOrganizerType}}
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
        organizer_type: 0
      }
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
    displayOrganizerType() {
      const type = this.event.organizer_type;
      if (type === 1000) {
        return "ユーザー";
      } else if (type === 2000) {
        return "オーナー";
      } else if (type === 3000) {
        return "システム管理者";
      } else {
        return "";
      }
    },
    isAdminCreate() {
      if (this.event.organizer_type === 3000) {
        return true;
      } else {
        return false;
      }
    }
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
        this.event.organizer_type = data.organizer_type;
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
    }
  }
};
</script>
