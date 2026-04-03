<template>
  <div class="checkbox-wrapper">
    <label class="checkbox-container">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        :disabled="disabled"
        class="checkbox-input"
      />
      <div class="checkbox-box">
        <svg v-if="modelValue" class="checkbox-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <span class="checkbox-label">{{ label }}</span>
    </label>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.checkbox-wrapper {
  display: flex;
  align-items: center;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 8px;
  background: transparent;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  display: none;
}

.checkbox-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e0;
  border-radius: 4px;
  background: transparent;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: pointer;
}

.checkbox-input:hover:not(:checked) + .checkbox-box {
  border-color: #a8d5d0;
  background: #f0fdfb;
}

.checkbox-input:checked + .checkbox-box {
  background: linear-gradient(135deg, #00a78e 0%, #008f78 100%);
  border-color: #00a78e;
  box-shadow: 0 2px 6px rgba(0, 167, 142, 0.2);
}

.checkbox-icon {
  width: 12px;
  height: 12px;
  color: white;
  flex-shrink: 0;
}

.checkbox-input:focus + .checkbox-box {
  outline: none;
  border-color: #00a78e;
  box-shadow: 0 0 0 3px rgba(0, 167, 142, 0.15);
}

.checkbox-input:disabled + .checkbox-box {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f3f4f6;
}

.checkbox-label {
  cursor: pointer;
}
</style>
