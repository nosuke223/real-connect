<template lang="pug">
  article#pane-dashboard.l-pane.l-pane--full.is-visible
    section.l-pane__body
      .p-scrollable
        // ↓ BEGIN Block Content
        .p-block-content-container
            b-col(cols="12")
              h1 イベントステータス作成
              b-card
                  b-form(@submit="submit")
                    b-form-group
                      label イベント名
                      b-form-input.border.border-dark( v-model="name" :state="nameState" placeholder="イベント名" aria-describedby="name-valid-error" )
                      b-form-invalid-feedback#name-valid-error イベント名を入力してください
                    b-button(type="submit" variant="primary") 作成

                
</template>

<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      name: "テスト",
    };
  },
  computed: {
    nameState() {
      return this.name.length > 0 ? true : false;
    },
  },
  methods: {
    submit() {
      console.log("submit");
    },
  },
};
</script>
