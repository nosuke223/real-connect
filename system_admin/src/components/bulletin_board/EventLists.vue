<template lang="pug">
  v-container.overflow-y-auto(style="max-height: 400px")
    v-row(dense)
      v-col(cols="12" v-for="event in events" :key="event.id")
        v-card
          v-card-title.headline {{event.name}}
          v-card-subtitle {{event.detail}}
          v-card-text
            span {{event.start_time}}開始
            br
            span {{event.area.name}}
          v-card-actions
            v-btn(color="primary" outlined :to="'/bulletin_board/' + event.id") 詳細
</template>

<script>
export default {
  props: {
    events: {
      type: Array,
      required: true
    }
  }
};
</script>
