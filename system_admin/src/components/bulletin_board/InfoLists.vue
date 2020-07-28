<template lang="pug">
  v-container.overflow-y-auto(style="max-height: 300px")
    div(v-for="(info, index) in items")
      v-card-subtitle {{info.title}}
      v-card-text {{info.text}}
      v-divider
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
};
</script>
