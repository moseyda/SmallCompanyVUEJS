<template>
  <div class="page-wrap">
    <section class="glass panel">
      <h1>Workspace Settings</h1>
      <p class="lead">Tune your profile, notifications, and operating defaults for the team.</p>
    </section>

    <section class="settings-grid">
      <article class="glass panel">
        <h2 class="section-title">Profile</h2>
        <div class="field-stack">
          <label class="field-label" for="name">Display Name</label>
          <input class="input-field" id="name" type="text" v-model="profile.name" data-test="display-name" :disabled="!canEditSettings" />

          <label class="field-label" for="email">Email</label>
          <input class="input-field" id="email" type="email" v-model="profile.email" :disabled="!canEditSettings" />

          <button class="btn btn-primary" @click="saveIfAllowed" :disabled="isLoading || !canEditSettings">Save Profile</button>
        </div>
      </article>

      <article class="glass panel">
        <h2 class="section-title">Preferences</h2>
        <div class="field-stack">
          <label class="field-label" id="cadence-label">Planning Cadence</label>
          <FilterDropdown
            id="cadence"
            class="cadence-dropdown"
            v-model="profile.cadence"
            :options="[
              { value: 'Weekly', label: 'Weekly' },
              { value: 'Fortnightly', label: 'Fortnightly' },
              { value: 'Monthly', label: 'Monthly' }
            ]"
            :disabled="!canEditSettings"
            aria-labelledby="cadence-label"
          />

          <label class="switch-row">
            <input type="checkbox" v-model="profile.notifyEmail" :disabled="!canEditSettings" />
            <span>Email updates</span>
          </label>

          <label class="switch-row">
            <input type="checkbox" v-model="profile.notifyPush" :disabled="!canEditSettings" />
            <span>Push alerts for launch blockers</span>
          </label>

          <label class="switch-row">
            <input type="checkbox" v-model="profile.shareSummary" :disabled="!canEditSettings" />
            <span>Share weekly digest with leadership</span>
          </label>
        </div>
      </article>
      

    </section>

    <p v-if="!canEditSettings" class="status">Read-only mode: your role can view but cannot edit settings.</p>
    <p v-if="error" class="status error">{{ error }}</p>
    <p v-if="saveState === 'saved'" class="status">Settings synced with API.</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '../stores/settings'
import { useAuthStore } from '../stores/auth'
import FilterDropdown from '../components/FilterDropdown.vue'

const settingsStore = useSettingsStore()
const { profile, isLoading, error, saveState } = storeToRefs(settingsStore)
const { fetchSettings, saveSettings } = settingsStore
const authStore = useAuthStore()
const { canEditSettings } = storeToRefs(authStore)

const saveIfAllowed = () => {
  if (!canEditSettings.value) {
    return
  }

  saveSettings()
}

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped>
h1 {
  font-size: clamp(1.65rem, 3.4vw, 2.65rem);
  margin-bottom: 0.7rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.field-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 13px;
  margin-top: 8px;
}

.input-field {
  width: 100%;
  padding: 10px 12px;
  margin: 8px 0 16px 0;
  border: 1px solid var(--line-strong);
  border-radius: 6px;
  background: rgba(19, 32, 51, 0.06);
  color: var(--ink-950);
  font-family: inherit;
  font-size: 13px;
  transition: all 0.2s ease;
}

.cadence-dropdown {
  margin: 8px 0 16px 0;
}

.input-field:focus {
  outline: none;
  border-color: var(--brand-teal);
  box-shadow: 0 0 0 3px rgba(0, 167, 142, 0.08);
}

.btn {
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid rgba(0, 167, 142, 0.4);
  background: linear-gradient(125deg, var(--brand-teal), #14c0a8);
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 5px 14px rgba(0, 167, 142, 0.22);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  font-size: 13px;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(125deg, var(--brand-teal), #14c0a8);
  color: white;
}

.switch-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ink-800);
}

.switch-row input {
  width: 16px;
  height: 16px;
}

.status {
  font-weight: 650;
  color: var(--ink-800);
}

.status.error {
  color: var(--danger-600);
}

@media (max-width: 860px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>
  