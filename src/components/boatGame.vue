<template>
  <h1>{{ dataForHUD }}</h1>
  <button @click="restartGame">Restart</button>
  <canvas id="gameCanvasBoard"></canvas>
</template>

<script>
import { startBoatGame } from "../scripts/lakeGame/lakeGame";
import { reactive, onMounted } from "vue";

export default {
  name: "boatGame",
  setup() {
    const dataForHUD = reactive({
      timeToStart: 3, // in seconds
      points: 0,
      remainingTime: 10, // in seconds
    });

    function restartGame() {
      dataForHUD.timeToStart = 3;
      dataForHUD.points = 0;
      dataForHUD.remainingTime = 10;
    }

    onMounted(() => {
      startBoatGame(dataForHUD);
    });

    return { dataForHUD, restartGame };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
