<template lang="pug">
    v-layout.full-height(justify-center align-center)
      v-card.pa-8(max-width="850px" width="100%")
        v-card-title {{ cardTitle }}
        v-card-text
          v-form(ref="form" @submit.prevent="submitEvent")
            slot(name="fields")
            v-btn(type="submit" color="primary" block ) {{ btnTitle }}

</template>

<script>
export default {
  props: {
    cardTitle: {
      type: String,
      required: true,
    },
    btnTitle: {
      type: String,
      required: true,
    },
  },
  methods: {
    submitEvent() {
      if (this.$refs.form.validate()) {
        this.$emit("submit");
      }
    },
  },
};
</script>
