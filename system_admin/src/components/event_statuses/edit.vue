<template lang="pug">
  v-col(cols="12")
    CommonForm(btnTitle="更新" cardTitle="イベントステータス修正" @submit="updateResource" @cancel="cancel")
      div(slot="fields")
        v-text-field(v-model="event_status.name" required :rules="nameRules" )
</template>

<script>
import CommonForm from "../utils/CommonForm";
import { notNullRule } from "@/utils/validation";
import ApiRequest from "@/api/base";

export default {
  components: {
    CommonForm,
  },
  data() {
    return {
      event_status: {
        id: this.$route.params.id,
        name: "",
      },
    };
  },
  computed: {
    nameRules() {
      return [(v) => notNullRule(v)];
    },
  },
  created() {
    this.fetchResource();
  },
  methods: {
    async fetchResource() {
      const request = new ApiRequest("event_statuses", this.$cookie);
      const { response, error } = await request.show(this.event_status.id);
      if (!error) {
        this.event_status.name = response.data.name;
      }
    },
    async updateResource() {
      const request = new ApiRequest("event_statuses", this.$cookie);
      const { error } = await request.update(
        this.event_status.id,
        this.event_status
      );
      if (!error) {
        this.$router.push("/event_statuses");
      } else {
        if (error.response.data) {
          alert(error.response.data.join("\n"));
        } else {
          alert("保存に失敗しました");
        }
      }
    },
    cancel() {
      this.$router.push(`/event_statuses/${this.event_status.id}`);
    },
  },
};
</script>
