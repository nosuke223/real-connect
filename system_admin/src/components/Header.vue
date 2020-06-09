<template>
  <div>
    <v-navigation-drawer v-model="drawer" app v-if="!isLoginPage">
      <v-list dense>
        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Top</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group prepend-icon="mdi-cog-outline">
          <template v-slot:activator>
            <v-list-item-title>ステータス管理</v-list-item-title>
          </template>
          <v-list-item link to="/event_statuses">
            <v-list-item-content>
              <v-list-item-title>イベントステータス</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link to="/user_statuses">
            <v-list-item-content>
              <v-list-item-title>ユーザーステータス</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item link to="/billing_management">
          <v-list-item-action>
            <v-icon>mdi-credit-card-check-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>課金管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="red" dense dark>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        v-if="!isLoginPage"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="cft c-logo__text"
        >Real-Connect システム管理画面</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-btn icon @click="requestLogout">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container class="fill-height" fluid>
        <slot name="main-content"></slot>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import ApiRequest from "@/api/base";

export default {
  data: () => ({
    drawer: false,
  }),
  computed: {
    isLoginPage() {
      return this.$route.path === "/login";
    },
  },
  methods: {
    async requestLogout() {
      const result = confirm("ログアウトしますか?");
      if (!result) return;
      const request = new ApiRequest("sessions", this.$cookie);
      const { error } = await request.requestWrapper("delete", "sessions");
      if (!error) {
        this.$cookie.delete("Authorization");
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style lang="scss">
.cft {
  font-family: "cft-fonts";
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: auto;
  font-style: normal;
  font-variant: normal;
  line-height: 1;
}

.c-logo__text {
  font-weight: normal;
  white-space: nowrap;
  font-size: 24px;
  letter-spacing: 1px;
}
</style>
