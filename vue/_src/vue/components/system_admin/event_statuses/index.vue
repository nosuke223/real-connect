<template lang="pug">
  article#pane-dashboard.l-pane.l-pane--full.is-visible
    section.l-pane__body
      .p-scrollable
        // ↓ BEGIN Block Content
        .p-block-content-container
          b-col(cols="12")
              h1 イベントステータス一覧
              b-card
                b-table( striped hover :items="items" @row-clicked="gotoEdit" :fields="fields" )
              b-btn(variant="success" @click="gotoCreate") 新規作成
                
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, name: "ステータス1" },
        { id: 2, name: "ステータス2" },
        { id: 3, name: "ステータス3" },
        { id: 4, name: "ステータス4" },
      ],
      fields: [
        { key: "id", sortable: true },
        { key: "name", sortable: true },
      ],
    };
  },
  methods: {
    gotoEdit(record, index) {
      this.$router.push(`/system_admin/event_statuses/edit/${record.id}`);
    },
    gotoCreate() {
      this.$router.push("/system_admin/event_statuses/create");
    },
  },
};
</script>
