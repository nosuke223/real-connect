<template lang="pug">
  v-menu(
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  )
    template(v-slot:activator="{ on, attrs }")
      v-text-field(
        v-model="time"
        :label="label"
        append-icon="mdi-clock"
        readonly
        v-bind="attrs"
        v-on="on"
        clearable
      )
    v-time-picker(
      v-if="menu"
      v-model="time"
      full-width
    )
</template>

<script>
export default {
  props: {
    value: {
      type: String,
    },
    label: {
      type: String,
    },
  },
  data() {
    return {
      menu: false,
    };
  },
  computed: {
    time: {
      get() {
        return this.value;
      },
      set(val) {
        this.menu = false;
        this.$emit("input", val);
      },
    },
  },
};
</script>
