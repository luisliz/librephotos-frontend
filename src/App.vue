<template>
  <v-app id="inspire">
    <v-app-bar app flat>
      <v-autocomplete
        class="mt-6"
        dense
        rounded
        solo
        label="Search for anything"
      ></v-autocomplete>
      <v-btn plain v-on:click="ToggleDarkMode">
        <v-icon v-if="$vuetify.theme.dark">mdi-white-balance-sunny</v-icon>
        <v-icon v-else>mdi-weather-night</v-icon>
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" class="ma-0" plain>
            <v-avatar color="grey" class="mr-3" size="32"></v-avatar>
            Name
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>test</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>test</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>test</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app permanent expand-on-hover>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img
              v-if="$vuetify.theme.dark"
              :src="require('./assets/logo-white.png')"
            ></v-img>
            <v-img v-else :src="require('./assets/logo.png')"></v-img>
          </v-list-item-avatar>
          <v-list-item-title><h3>LibrePhotos</h3></v-list-item-title>
        </v-list-item>
        <v-list-item key="icon">
          <v-list-item-icon>
            <v-icon color="orange">mdi-sync</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Importing</v-list-item-title>
            <v-list-item-subtitle>500/102470</v-list-item-subtitle>
            <v-progress-linear value="15" color="green"></v-progress-linear>
          </v-list-item-content>
        </v-list-item>
        <v-list-item key="icon">
          <v-list-item-icon>
            <v-icon color="green">mdi-check</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Completed</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider />
      <v-list>
        <v-list-item
          v-for="[icon, text, link] in links"
          :key="icon"
          :to="link"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",
  components: {},
  mounted() {
    const theme = localStorage.getItem("dark_theme");
    if (theme) {
      if (theme == "true") {
        this.$vuetify.theme.dark = true;
      } else {
        this.$vuetify.theme.dark = false;
      }
    }
  },
  methods: {
    ToggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("dark_theme", this.$vuetify.theme.dark.toString());
    },
  },
  data: () => ({
    drawer: null,
    links: [
      ["mdi-image", "Photos", "/"],
      ["mdi-image-album", "Albums", "albums"],
      ["mdi-chart-donut", "Data Visualization", "data"],
      ["mdi-monitor", "Dashboard", "dashboard"],
      ["mdi-share-variant", "Sharing", "share"],
      ["mdi-delete", "Trash", "trash"],
      ["mdi-cog", "Settings", "settings"],
      ["mdi-help-circle-outline", "Help", "help"],
    ],
  }),
});
</script>
