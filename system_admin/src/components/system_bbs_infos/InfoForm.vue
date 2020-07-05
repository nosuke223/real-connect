<template lang="pug">
  v-col(cols="12")
    CommonForm(:btnTitle="btnTitle" :cardTitle="formTitle" @submit="createResource" @cancel="cancel")
      div(slot="fields")
        v-text-field(v-model="formProps.detail" required :rules="notNullRules" label="詳細")
        v-menu(
          v-model="menu"
          transition="scale-transition"
          offset-y
        )
          template(v-slot:activator="{on}")
            v-text-field(
              v-model="formProps.display_date"
              readonly required
              :rules="notNullRules"
              label="日付"
              append-icon="mdi-calendar"
              v-on="on"
              clearable
            )
          v-date-picker(
            v-model="formProps.display_date"
            no-title
            scrollable
            locale="ja-jp"
            :day-format="date => new Date(date).getDate()"
          )
        v-select(v-model="formProps.display_flag" :items="flags"  label="表示フラグ" clearable)
</template>

<script>
import CommonForm from "../utils/CommonForm";
import { notNullRule } from "@/utils/validation";
import { formatDate } from "@/utils/format_date";
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
      flags: [
        { text: "表示する", value: true },
        { text: "表示しない", value: false },
      ],
      formProps: {
        detail: "",
        display_flag: true,
        display_date: formatDate(new Date()),
      },
      menu: false,
    };
  },
  computed: {
    notNullRules() {
      return [(v) => notNullRule(v)];
    },
  },
  created() {
    this.fetchResource();
  },
  methods: {
    async fetchResource() {
      // 編集のときだけ既存レコードの情報取得
      if (this.id) {
        const request = new ApiRequest("system_bbs_infos", this.$cookie);
        const { response, error } = await request.show(this.id);
        if (!error) {
          const data = response.data;
          this.formProps.detail = data.detail;
          this.formProps.display_flag = data.display_flag;
          this.formProps.display_date = formatDate(data.display_date);
        }
      }
    },
    createResource() {
      this.$emit("createResource", this.formProps);
    },
    cancel() {
      if (this.$route.params.id) {
        this.$router.push(`/system_bbs_infos/${this.$route.params.id}`);
      } else {
        this.$router.push(`/system_bbs_infos`);
      }
    },
  },
};
</script>
