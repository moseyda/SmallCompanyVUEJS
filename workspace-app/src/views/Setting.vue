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
          <input class="input-field" id="name" type="text" v-model="profile.name" data-test="display-name" />

          <label class="field-label" for="email">Email</label>
          <input class="input-field" id="email" type="email" v-model="profile.email" />

          <button class="btn btn-primary" @click="saveSettings" :disabled="isLoading">Save Profile</button>
        </div>
      </article>

      <article class="glass panel">
        <h2 class="section-title">Preferences</h2>
        <div class="field-stack">
          <label class="field-label" for="cadence">Planning Cadence</label>
          <select class="select-field" id="cadence" v-model="profile.cadence">
            <option>Weekly</option>
            <option>Bi-weekly</option>
            <option>Monthly</option>
          </select>

          <label class="switch-row">
            <input type="checkbox" v-model="profile.notifyEmail" />
            <span>Email updates</span>
          </label>

          <label class="switch-row">
            <input type="checkbox" v-model="profile.notifyPush" />
            <span>Push alerts for launch blockers</span>
          </label>

          <label class="switch-row">
            <input type="checkbox" v-model="profile.shareSummary" />
            <span>Share weekly digest with leadership</span>
          </label>
        </div>
      </article>
    </section>

    <p v-if="error" class="status error">{{ error }}</p>
    <p v-if="saveState === 'saved'" class="status">Settings synced with API.</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()
const { profile, isLoading, error, saveState } = storeToRefs(settingsStore)
const { fetchSettings, saveSettings } = settingsStore

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
  