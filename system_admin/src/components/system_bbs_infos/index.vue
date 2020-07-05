<template lang="pug">
  v-col(cols="12")
    ItemTable(:items="items" :headers="headers" btnTitle="新規作成" tableTitle="お知らせ(info)一覧" @rowClicked="gotoShow" @btnClicked="gotoCreate")
</template>

<script>
import ItemTable from "../utils/ItemTable";
import ApiRequest from "@/api/base";

export default {
  components: {
    ItemTable,
  },
  data() {
    return {
      items: [],
      headers: [
        { text: "ID", value: "id" },
        { text: "詳細", value: "detail" },
        { text: "日付", value: "display_date" },
        { text: "表示フラグ", value: "display_flag" },
      ],
    };
  },
  async created() {
    const request = new ApiRequest("system_bbs_infos", this.$cookie);
    const { response, error } = await request.index();
    if (!error) {
      const data = response.data;
      data.map((record) => {
        if (record.display_flag) {
          record.display_flag = "表示する";
        } else {
          record.display_flag = "表示しない";
        }
        return record;
      });
      this.items = data;
    }
  },
  methods: {
    gotoShow(data) {
      this.$router.push(`/system_bbs_infos/${data.id}`);
    },
    gotoCreate() {
      this.$router.push("/system_bbs_infos/create");
    },
  },
};
</script>
