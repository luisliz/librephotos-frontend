<template>
  <span>
    <v-toolbar dense class="ma-2">
      <h3>Today</h3>
      <v-spacer></v-spacer>
      <div class="overline">
        <v-icon>mdi-map-marker</v-icon>

        Location1, Location2
      </div>
    </v-toolbar>
    <v-container fluid>
      <ul>
        <!--  Adding an empty <li> here so the final photo doesn't stretch like crazy. Try removing it and see what happens!  -->
        <li v-for="image in images" v-bind:key="image" class="pa-1">
          <img :src="image" alt="sdf" loading="lazy" />
        </li>
        <li></li></ul
    ></v-container>
  </span>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "PhotoByGroup",
  data: () => ({
    randItems: 0,
    images: [
      "https://picsum.photos/200/300",
      "https://picsum.photos/224/583",
      "https://picsum.photos/208/356",
      "https://picsum.photos/474/500",
      "https://picsum.photos/408/506",
      "https://picsum.photos/538/577",
      "https://picsum.photos/286/590",
      "https://picsum.photos/247/532",
      "https://picsum.photos/232/485",
      "https://picsum.photos/221/426",
      "https://picsum.photos/226/321",
      "https://picsum.photos/276/402",
      "https://picsum.photos/225/569",
      "https://picsum.photos/256/480",
      "https://picsum.photos/436/448",
      "https://picsum.photos/397/481",
      "https://picsum.photos/225/545",
      "https://picsum.photos/324/575",
      "https://picsum.photos/351/469",
      "https://picsum.photos/309/347",
      "https://picsum.photos/203/535",
      "https://picsum.photos/319/462",
      "https://picsum.photos/206/335",
      "https://picsum.photos/237/485",
      "https://picsum.photos/298/346",
      "https://picsum.photos/504/560",
      "https://picsum.photos/243/443",
      "https://picsum.photos/344/350",
      "https://picsum.photos/464/574",
      "https://picsum.photos/360/383",
      "https://picsum.photos/446/546",
      "https://picsum.photos/410/524",
      "https://picsum.photos/242/553",
      "https://picsum.photos/462/563",
      "https://picsum.photos/242/365",
      "https://picsum.photos/230/519",
      "https://picsum.photos/203/310",
      "https://picsum.photos/428/444",
      "https://picsum.photos/295/356",
      "https://picsum.photos/325/424",
      "https://picsum.photos/216/365",
    ],
  }),
  mounted() {
    this.randItems = this.getRandomSize(2, 50);
  },
  methods: {
    getRandomSize(min: number, max: number) {
      return Math.round(Math.random() * (max - min) + min);
    },
  },
});
</script>
<style lang="scss">
// BASIC

ul {
  display: flex;
  flex-wrap: wrap;
}

li {
  list-style-type: none;
  height: 40vh;
  flex-grow: 1;
}

li:last-child {
  // There's no science in using "10" here. In all my testing, this delivered the best results.
  flex-grow: 10;
}

img {
  max-height: 100%;
  min-width: 100%;
  object-fit: cover;
  vertical-align: bottom;
}

// ADVANCED

// Portrait

@media (max-aspect-ratio: 1/1) {
  li {
    height: 30vh;
  }
}

// Short screens

@media (max-height: 480px) {
  li {
    height: 80vh;
  }
}

// Smaller screens in portrait

@media (max-aspect-ratio: 1/1) and (max-width: 480px) {
  ul {
    flex-direction: row;
  }

  li {
    height: auto;
    width: 100%;
  }

  img {
    width: 100%;
    max-height: 75vh;
    min-width: 0;
  }
}
</style>
