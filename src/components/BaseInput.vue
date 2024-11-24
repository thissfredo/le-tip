<template>
    <input class="base-input" :type="type" :value="value" @input="$emit('input', $event.target.value)" :min="min" :max="max" />
</template>

<script>
export default {
    name: 'BaseInput',
    props: ['value', 'type', 'min', 'max',]
}
</script>

<style scoped>
.base-input {
    border: none;
    height: 34px;
    width: 100%;
}
</style>