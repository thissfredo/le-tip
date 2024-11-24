<template>
  <input type="range" :min="min" :max="max" :value="value" @input="$emit('input', $event.target.value)"
    class="slide-container__slider">
</template>

<script>
export default {
  name: 'BaseInputSlider',
  props: ['value', 'min', 'max'],
}
</script>

<style scoped>
.slide-container {
  width: auto;
}

.slide-container__slider {
  -webkit-appearance: none;
  width: 100%;
  height: 3px;
  background: #2c3e50;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slide-container__slider:hover {
  opacity: 1;
}

.slide-container__slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  background: #2c3e50;
  cursor: pointer;
}

.slide-container__slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: #2c3e50;
  cursor: pointer;
}
</style>