<template>
  <div class="flex">
    <boatGameHUD :data="dataForHUD" />
    <canvas id="gameCanvasBoard"></canvas>

    <!-- Backdrop -->
    <transition name="fade">
      <div v-show="dataForHUD.timeToStart > 0 || dataForHUD.remainingTime <= 0" class="backdrop">
        <!-- timeToStart Counter -->
        <div v-if="dataForHUD.timeToStart < 3 && dataForHUD.timeToStart > 0" class="time-to-start-counter z-10">
          {{ Math.floor(dataForHUD.timeToStart) + 1 }}
        </div>

        <!-- Setting modal -->
        <div v-if="!dataForHUD.gameStarted" class="z-10 text-center">
          <h1 class="text-5xl mb-8">Witaj!</h1>

          <div class="flex justify-center items-center mb-5">
            <h2 class="mr-5">Jakoć grafiki:</h2>
            <select class="text-balck" v-model="userSettings.graphicQuality">
              <option value="low">niskie</option>
              <option selected value="normal">normalne</option>
            </select>
          </div>

          <div class="flex justify-center items-center mb-5">
            <h2 class="mr-5">Autorotacja kamery:</h2>
            <select class="text-balck" v-model="userSettings.cameraRotation">
              <option value="off">Wyłączona</option>
              <option selected value="on">Włączona</option>
            </select>
          </div>

          <button
            @click="
              startBoatGame(dataForHUD, userSettings);
              dataForHUD.gameStarted = true;
            "
            class="bg-cdark mt-8 px-8 py-3 rounded-lg transition-colors duration-500 hover:bg-cgreen"
          >
            Rozpocznij grę!
          </button>
        </div>

        <!-- Game over modal -->
        <div v-if="dataForHUD.remainingTime <= 0" class="z-10 text-center">
          <gameoverModalBody :data="dataForHUD" />
          <button
            @click="restartGame"
            class="bg-cdark mt-8 px-8 py-3 rounded-lg transition-colors duration-500 hover:bg-cgreen"
          >
            Zagraj jescze raz!
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { startBoatGame } from "../scripts/lakeGame/lakeGame";
import { reactive } from "vue";
import boatGameHUD from "./boatGameHUD.vue";
import gameoverModalBody from "./gameoverModalBody.vue";

export default {
  name: "boatGame",
  components: { boatGameHUD, gameoverModalBody },
  setup() {
    const dataForHUD = reactive({
      timeToStart: 3, // in seconds
      points: 0,
      remainingTime: 10, // in seconds
      gameStarted: false,
    });

    const userSettings = reactive({
      graphicQuality: "normal", // normal or low
      cameraRotation: "on", // on or off
    });

    function restartGame() {
      dataForHUD.timeToStart = 3;
      dataForHUD.points = 0;
      dataForHUD.remainingTime = 10;
    }

    return { dataForHUD, userSettings, startBoatGame, restartGame };
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
  }

  select {
    background-color: transparent;
    border: 1px solid #fff;
    border-radius: 5px;
    padding: 5px 15px;
  }

  option {
    color: #000;
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
