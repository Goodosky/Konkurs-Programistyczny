<template>
  <div style="width: 300px" class="text-center mt-12">
    <p class="text-lg mb-1">Pozostały czas:</p>
    <h2 class="text-4xl mb-12" :class="{ 'text-red-500': data.remainingTime < 3 }">
      {{ data.remainingTime.toFixed(2) }}
    </h2>

    <p class="text-lg mb-1">Ilość punktów:</p>
    <h2 class="text-4xl mb-12">{{ data.points }}</h2>
  </div>
</template>

<script>
export default {
  name: "boatGameHUD",
  props: { data: Object },
};
</script>
