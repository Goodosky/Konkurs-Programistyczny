<template>
  <canvas id="gameCanvasBoard"></canvas>
</template>

<script>
import { startBoatGame } from "../scripts/lakeGame/lakeGame";
import { onMounted } from "vue";

export default {
  name: "HelloWorld",
  setup() {
    onMounted(() => {
      startBoatGame();
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
