<template lang="pug">
    v-card
      v-card-title {{ tableTitle }}
      .d-flex.justify-end.ma-2
        v-btn(text small color="primary" dark @click="emitBtnClicked") {{ btnTitle }}
      v-data-table(:headers="headers" :items="items" no-data-text="表示するデータが有りません" @click:row="emitRowClicked")
      
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
      required: true,
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
