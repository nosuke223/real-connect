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
