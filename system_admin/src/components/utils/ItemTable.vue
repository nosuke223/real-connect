<template lang="pug">
  div
    p.headline {{ tableTitle }}
    .d-flex.justify-end.ma-2
      v-btn(color="primary" @click="emitBtnClicked" v-if="btnTitle") {{ btnTitle }}
    v-data-table(:headers="headers" :items="items" no-data-text="表示するデータが有りません" @click:row="emitRowClicked" class="color-header")
      
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    tableTitle: {
      type: String,
      required: true,
    },
    btnTitle: {
      type: String,
      required: false,
    },
  },
  methods: {
    emitRowClicked(data) {
      if (data) this.$emit("rowClicked", data);
    },
    emitBtnClicked() {
      this.$emit("btnClicked");
    },
  },
};
</script>
