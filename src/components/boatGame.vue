<template>
  <button @click="restartGame">RESTART</button>
  <div class="flex">
    <boatGameHUD :data="dataForHUD"></boatGameHUD>
    <canvas id="gameCanvasBoard"></canvas>

    <!-- Backdrop -->
    <transition name="fade">
      <div v-show="dataForHUD.timeToStart > 0" class="backdrop">
        <!-- timeToStart Counter -->
        <div v-if="dataForHUD.timeToStart < 3" class="time-to-start-counter">
          {{ Math.floor(dataForHUD.timeToStart) + 1 }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { startBoatGame } from "../scripts/lakeGame/lakeGame";
import { reactive, onMounted } from "vue";
import boatGameHUD from "./boatGameHUD.vue";

export default {
  name: "boatGame",
  components: { boatGameHUD },
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
<style lang="scss">
.backdrop {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(#000, 0.8);
    backdrop-filter: blur(2px);
  }

  .time-to-start-counter {
    font-size: 15rem;
    z-index: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: transform 0.9s, opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
