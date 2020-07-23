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
        <v-list-item link to="/users">
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>一般ユーザー管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/owners">
          <v-list-item-action>
            <v-icon>mdi-store</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>店舗ユーザー管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/events">
          <v-list-item-action>
            <v-icon>mdi-beer</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>イベント管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/messages">
          <v-list-item-action>
            <v-icon>mdi-chat</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>メッセージ管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/areas">
          <v-list-item-action>
            <v-icon>mdi-map</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>エリア管理</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/places">
          <v-list-item-action>
            <v-icon>mdi-store</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>店舗管理</v-list-item-title>
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
        <v-list-group prepend-icon="mdi-text-box-check-outline">
          <template v-slot:activator>
            <v-list-item-title>申請管理</v-list-item-title>
          </template>
          <v-list-item link to="/temp_areas">
            <v-list-item-content>
              <v-list-item-title>エリア申請管理</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link to="/temp_places">
            <v-list-item-content>
              <v-list-item-title>店舗申請管理</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-group prepend-icon="mdi-newspaper-plus">
          <template v-slot:activator>
            <v-list-item-title>お知らせ管理</v-list-item-title>
          </template>
          <v-list-item link to="/system_bbs_news">
            <v-list-item-content>
              <v-list-item-title>news管理</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link to="/system_bbs_infos">
            <v-list-item-content>
              <v-list-item-title>info管理</v-list-item-title>
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

    <v-app-bar app color="teal lighten-2" dense dark>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        v-if="!isLoginPage"
      ></v-app-bar-nav-icon>
      <span class="c-logo__symbol glyph glyph-brand-logo" />
      <v-toolbar-title class="cft c-logo__text" v-if="!isLoginPage"
        >Real-Connect システム管理画面</v-toolbar-title
      >
      <v-toolbar-title class="cft c-logo__text" v-else
        >Real-Connect</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-btn icon @click="requestLogout" v-if="!isLoginPage">
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
      return (
        this.$route.path === "/login" ||
        this.$route.path === "/place_application/create"
      );
    },
  },
  methods: {
    async requestLogout() {
      const result = confirm("ログアウトしますか?");
      if (!result) return;
      const request = new ApiRequest("sessions", this.$cookie, "api/v1");
      const { error } = await request.requestWrapper("delete", "sessions");
      if (!error) {
        this.$cookie.delete("Authorization");
        this.$router.push("/login");
      }
    },
  },
};
</script>
