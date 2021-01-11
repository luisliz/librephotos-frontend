<template>
  <div class="photos">
    
    <h2 class="font-weight-black pl-4 pt-4">
      <v-icon>mdi-image</v-icon>
      Photos
    </h2>
    <PhotoByGroup></PhotoByGroup>
    <PhotoByGroup></PhotoByGroup>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PhotoByGroup from "@/components/PhotoByGroup.vue"; // @ is an alias to /src
@Component({
  components: {
    PhotoByGroup
  }
})
export default class Photos extends Vue {}
</script>
