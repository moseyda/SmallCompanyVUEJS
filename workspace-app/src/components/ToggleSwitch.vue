<template>
  <button
    :class="['toggle-switch', { active: value }]"
    :aria-pressed="value"
    @click="$emit('change', !value)"
    type="button"
  >
    <span class="toggle-thumb"></span>
  </button>
</template>

<script setup>
defineProps({
  value: Boolean
})

defineEmits(['change'])
</script>

<style scoped>
.toggle-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 44px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 12px;
  background: var(--ink-300);
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
  }

  &.active {
    background: linear-gradient(125deg, var(--brand-teal), #14c0a8);

    .toggle-thumb {
      left: 22px;
    }
  }
}

.toggle-thumb {
  position: absolute;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: left 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
