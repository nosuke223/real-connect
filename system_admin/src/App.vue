<template>
  <v-app>
    <Header>
      <template slot="main-content">
        <router-view></router-view>
      </template>
    </Header>
  </v-app>
</template>

<script>
import Header from "./components/Header";

export default {
  name: "App",
  components: {
    Header,
  },

  data: () => ({
    //
  }),
};
</script>

<style>
.v-application--wrap {
  background-color: #efebe9;
  color: #555555;
}
.color-header thead {
  background-color: #52c2d0;
}
</style>
