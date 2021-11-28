<template>
  <div class="z-10 text-center">
    <h1 class="text-5xl mb-8">Porażka!</h1>
    <p class="text-4xl">
      Zdobyto:
      <span class="text-red-600 ml-5"> {{ data.points }} {{ getInflection(data.points) }} </span>
    </p>
  </div>
</template>

<script>
export default {
  name: "gameoverModalBody",
  props: { data: Object },
  setup() {
    function getInflection(numberOfPoints) {
      const lastNumber = numberOfPoints % 10;

      if (lastNumber == 1) {
        return "punkt";
      } else if (lastNumber > 0 && lastNumber < 5) {
        return "punkty";
      } else return "punktów";
    }

    return { getInflection };
  },
};
</script>
