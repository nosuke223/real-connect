<template lang="pug">
  v-col(cols="12")
    CommonForm(:btnTitle="btnTitle" :cardTitle="formTitle" @submit="createResource" @cancel="cancel")
      div(slot="fields")
        v-text-field(v-model="formProps.name" required :rules="nameRules" label="名前")
        v-text-field(v-model="formProps.detail" type="text" label="詳細")
        v-text-field(v-model="formProps.capacity" required label="参加可能人数")
        v-select(v-model="formProps.area_id" :items="areas"  label="地域（エリア)" clearable)
        v-select(v-model="formProps.event_status_id" :items="statuses" label="ステータス" clearable)
        v-datetime-picker(label="開始日時" v-model="formProps.start_time" :datePickerProps="pickerProp" clearText="クリア" okText="次へ")
          template(slot="dateIcon")
            v-icon mdi-calendar
          template(slot="timeIcon")
            v-icon mdi-clock
        v-datetime-picker(label="終了日時" v-model="formProps.end_time" :datePickerProps="pickerProp" clearText="クリア" okText="次へ")
          template(slot="dateIcon")
            v-icon mdi-calendar
          template(slot="timeIcon")
            v-icon mdi-clock
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
      areas: [],
      statuses: [],
      pickerProp: {
        locale: "ja-jp",
        "day-format": (date) => new Date(date).getDate(),
        "next-month-aria-label": "",
        "prev-month-aria-label": "",
        "next-year-aria-label": "",
        "prev-year-aria-label": "",
      },
      formProps: {
        name: "",
        detail: "",
        capacity: "",
        area_id: 0,
        start_time: new Date(),
        end_time: new Date(),
        event_status_id: 0,
      },
    };
  },
  computed: {
    nameRules() {
      return [(v) => notNullRule(v)];
    },
  },
  created() {
    this.fetchAreas();
    this.fetchEventStatuses();
    this.fetchResource();
  },
  methods: {
    async fetchResource() {
      // 編集のときだけ既存レコードの情報取得
      if (this.id) {
        const request = new ApiRequest("events", this.$cookie);
        const { response, error } = await request.show(this.id);
        if (!error) {
          const data = response.data;
          this.formProps.name = data.name;
          this.formProps.detail = data.detail;
          this.formProps.capacity = data.capacity;
          this.formProps.area_id = data.area_id;
          this.formProps.start_time = new Date(data.start_time);
          this.formProps.end_time = new Date(data.end_time);
          this.formProps.event_status_id = data.event_status_id;
        }
      }
    },
    createResource() {
      this.$emit("createResource", this.formProps);
    },
    cancel() {
      if (this.$route.params.id) {
        this.$router.push(`/events/${this.$route.params.id}`);
      } else {
        this.$router.push(`/events`);
      }
    },
    async fetchAreas() {
      const request = new ApiRequest("areas", this.$cookie);
      const { response, error } = await request.index();
      if (!error) {
        this.areas = response.data.map((record) => {
          return { text: record.name, value: record.id };
        });
      }
    },
    async fetchEventStatuses() {
      const request = new ApiRequest("event_statuses", this.$cookie);
      const { response, error } = await request.index();
      if (!error) {
        this.statuses = response.data.map((record) => {
          return { text: record.name, value: record.id };
        });
      }
    },
  },
};
</script>
