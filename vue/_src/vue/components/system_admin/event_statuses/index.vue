<template lang="pug">
  article#pane-dashboard.l-pane.l-pane--full.is-visible
    section.l-pane__body
      .p-scrollable
        // ↓ BEGIN Block Content
        .p-block-content-container
          v-col(cols="12")
            ItemTable(:items="items" :headers="headers" btnTitle="新規作成" tableTitle="イベントステータス一覧" @rowClicked="gotoShow" @btnClicked="gotoCreate")
                
</template>

<script>
import ItemTable from "../utils/itemTable.vue";
import ApiRequest from "../../../api/base.js";

export default {
  components: {
    ItemTable,
  },
  data() {
    return {
      items: [],
      headers: [
        { text: "ID", value: "id" },
        { text: "名前", value: "name" },
      ],
    };
  },
  async mounted() {
    const request = new ApiRequest("event_statuses", this.$cookie);
    const { response, error } = await request.index();
    if (!error) {
      this.items = response.data;
    }
  },
  methods: {
    gotoShow(data) {
      this.$router.push(`/system_admin/event_statuses/${data.id}`);
    },
    gotoCreate() {
      this.$router.push("/system_admin/event_statuses/create");
    },
  },
};
</script>
