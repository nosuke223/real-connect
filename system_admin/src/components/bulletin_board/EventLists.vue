<template lang="pug">
  v-container.overflow-y-auto(style="max-height: 400px")
    div(v-for="(event, index) in events")
      v-divider(v-if="index === 0")
      v-card-title {{event.name}}
        v-chip.mx-1(v-if="event.organizer_type === 2000" color="green" text-color="white" small) 店舗主催 
        v-chip.mx-1(v-else-if="event.organizer_type === 1000" color="primary" text-color="white" small) ユーザー主催 
      v-card-subtitle 
        div
          v-icon(small) mdi-map
          span {{event.area_id ? event.area.name : ''}}
        div
          v-icon(small) mdi-clock
          span {{event.start_time}} ~ {{event.end_time}}
        div
          v-icon(small color="primary") mdi-face
          span {{event.male}}
          v-icon(small color="pink") mdi-face-woman
          span {{event.female}}
        v-card-actions
          v-btn.white--text(color="orange" @click="gotoShow(event.id)" small) 詳細
      v-divider
</template>

<script>
export default {
  props: {
    events: {
      type: Array,
      required: true,
    },
  },
  methods: {
    gotoShow(id) {
      this.$router.push(`/bulletin_board/${id}`);
    },
  },
};
</script>
