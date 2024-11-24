<template>
  <label class="switch-container">
    <input type="checkbox" class="switch-container__switch-input" :checked="modelValue"
      @input="updateChecked($event)" />
    <span class="switch-container__toggle"></span>
  </label>
</template>

<script>
export default {
  name: 'BaseInputSwitch',
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    }
  },
  methods: {
    updateChecked(event) {
      this.$emit('input', event.target.checked);
    }
  }
}
</script>

<style scoped>
.switch-container {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch-container__switch-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-container__toggle {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.switch-container__toggle:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

.switch-container__switch-input:checked+.switch-container__toggle {
  background-color: #2c3e50;
}

.switch-container__switch-input:focus+.switch-container__toggle {
  box-shadow: 0 0 1px #2c3e50;
}

.switch-container__switch-input:checked+.switch-container__toggle:before {
  transform: translateX(26px);
}
</style>