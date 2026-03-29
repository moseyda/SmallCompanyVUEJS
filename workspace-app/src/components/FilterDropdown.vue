<template>
  <div class="filter-dropdown" ref="dropdownRef">
    <button
      class="filter-dropdown-trigger"
      @click="toggleMenu"
      :aria-expanded="isOpen"
      :aria-label="label"
    >
      <span class="trigger-text">{{ selectedLabel }}</span>
      <span class="material-icons dropdown-icon">expand_more</span>
    </button>

    <div v-if="isOpen" class="filter-dropdown-menu">
      <button
        v-for="option in options"
        :key="option.value"
        class="dropdown-option"
        :class="{ active: modelValue === option.value }"
        @click="selectOption(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: 'Filter'
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected ? selected.label : props.options[0].label
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (value) => {
  emit('update:modelValue', value)
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.filter-dropdown {
  position: relative;
  width: 100%;
}

.filter-dropdown-trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: #f0f2f5;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.filter-dropdown-trigger:hover {
  border-color: var(--color-primary);
  background-color: #eaecf0;
}

.filter-dropdown-trigger:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.trigger-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-icon {
  font-size: 20px;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.filter-dropdown-trigger[aria-expanded="true"] .dropdown-icon {
  transform: rotate(180deg);
}

.filter-dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 1000;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  min-width: 180px;
}

.dropdown-option {
  display: block;
  width: 100%;
  padding: 12px 14px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.dropdown-option:hover {
  background: #f0f2f5;
  color: var(--color-primary);
}

.dropdown-option.active {
  background: linear-gradient(90deg, #f0f2f5 0%, transparent 100%);
  color: var(--color-primary);
  font-weight: 700;
  border-left: 3px solid var(--color-primary);
  padding-left: 11px;
}

.dropdown-option:first-child {
  border-top: none;
}
</style>
