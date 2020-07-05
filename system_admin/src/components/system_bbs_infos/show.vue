<template lang="pug">
  v-col(cols="12")
    .d-flex.justify-end
      v-btn.mr-2(color="primary" fab dark @click="gotoEdit")
        v-icon mdi-pencil
      v-btn(color="error" fab dark @click="deleteResource")
        v-icon mdi-delete
    p.headline お知らせ(info)詳細
    v-divider
    div.title
      v-row
        v-col(cols="12")
          p 詳細:{{systemBbsInfo.detail}}
          p 表示:{{displayFlag}}
          p 日付:{{systemBbsInfo.displayDate}}
</template>

<script>
import ApiRequest from "@/api/base";
import { formatDate } from "@/utils/format_date";

export default {
  data() {
    return {
      systemBbsInfo: {
        id: this.$route.params.id,
        detail: "",
        displayFlag: false,
        displayDate: "",
      },
    };
  },
  created() {
    this.fetchResource();
  },
  computed: {
    displayFlag() {
      if (this.systemBbsInfo.displayFlag) {
        return "表示する";
      } else {
        return "表示しない";
      }
    },
  },
  methods: {
    async fetchResource() {
      const request = new ApiRequest("system_bbs_infos", this.$cookie);
      const { response, error } = await request.show(this.systemBbsInfo.id);
      if (!error) {
        const data = response.data;
        this.systemBbsInfo.detail = data.detail;
        this.systemBbsInfo.displayFlag = data.display_flag;
        this.systemBbsInfo.displayDate = formatDate(data.display_date);
      }
    },
    async deleteResource() {
      const result = confirm("削除してよろしいですか");
      if (!result) return;
      const request = new ApiRequest("system_bbs_infos", this.$cookie);
      const { error } = await request.destroy(this.systemBbsInfo.id);
      if (!error) {
        this.$router.push("/system_bbs_infos");
      }
    },
    gotoEdit() {
      this.$router.push(`/system_bbs_infos/${this.systemBbsInfo.id}/edit`);
    },
  },
};
</script>
