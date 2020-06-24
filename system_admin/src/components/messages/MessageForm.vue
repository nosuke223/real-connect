<template lang="pug">
  v-col(cols="12")
    CommonForm(:btnTitle="btnTitle" :cardTitle="formTitle" @submit="createResource" @cancel="cancel")
      div(slot="fields")
        v-text-field(v-model="formProps.body" required :rules="nameRules" label="メッセージ内容")
        v-select(v-model="formProps.event_id" :items="events" :rules="nameRules" label="イベント" clearable)
        v-select(v-model="formProps.sender_id" :items="users" :rules="nameRules" label="送信者" clearable)
        v-select(v-model="formProps.partner_id" :items="users" :rules="nameRules" label="受信者" clearable)
</template>

<script>
import CommonForm from "../utils/CommonForm";
import { notNullRule } from "@/utils/validation";
import ApiRequest from "@/api/base";

export default {
  props: {
    id: {
      type: String,
      required: false,
    },
    formTitle: {
      type: String,
      required: true,
    },
    btnTitle: {
      type: String,
      required: true,
    },
  },
  components: {
    CommonForm,
  },
  data() {
    return {
      events: [],
      users: [],
      formProps: {
        body: "",
        event_id: 0,
        sender_id: 0,
        partner_id: 0,
      },
    };
  },
  computed: {
    nameRules() {
      return [(v) => notNullRule(v)];
    },
  },
  created() {
    this.fetchUsers();
    this.fetchEvents();
    this.fetchResource();
  },
  methods: {
    async fetchResource() {
      if (this.id) {
        const request = new ApiRequest("messages", this.$cookie);
        const { response, error } = await request.show(this.id);
        if (!error) {
          const data = response.data;
          this.formProps.body = data.body;
          this.formProps.image = data.image;
          this.formProps.event_id = data.event_id;
          this.formProps.sender_id = data.sender_id;
          this.formProps.partner_id = data.partner_id;
        }
      }
    },
    createResource() {
      this.$emit("createResource", this.formProps);
    },
    cancel() {
      if (this.$route.params.id) {
        this.$router.push(`/messages/${this.$route.params.id}`);
      } else {
        this.$router.push(`/messages`);
      }
    },
    async fetchUsers() {
      const request = new ApiRequest("users?role=user", this.$cookie);
      const { response, error } = await request.index({
        role: "user",
      });
      if (!error) {
        this.users = response.data.map((record) => {
          return { text: record.email, value: record.id };
        });
      }
    },
    async fetchEvents() {
      const request = new ApiRequest("events", this.$cookie);
      const { response, error } = await request.index();
      if (!error) {
        this.events = response.data.map((record) => {
          return { text: record.name, value: record.id };
        });
      }
    },
  },
};
</script>
