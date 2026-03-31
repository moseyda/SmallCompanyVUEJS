<template>
  <div class="github-app-onboard">
    <h3>GitHub App Onboarding</h3>
    <p class="muted">Install the GitHub App to allow this server to create branches and pull requests on behalf of your workspace.</p>

    <div class="actions">
      <button class="btn" @click="fetchInstallations" :disabled="loading">Refresh Installations</button>
      <span v-if="loading" class="muted">Loading…</span>
    </div>

    <div v-if="installations?.length" class="install-list">
      <h4>Installations</h4>
      <ul>
        <li v-for="inst in installations" :key="inst.id" class="inst-item">
          <div class="inst-main">
            <strong>{{ inst.account?.login || inst.account?.name || 'Account' }}</strong>
            <small class="muted">ID: {{ inst.id }} • Repos: {{ inst.repository_selection }}</small>
          </div>
          <div class="inst-actions">
            <button class="btn" @click="selectInstallation(inst)">Use this installation</button>
            <button class="btn secondary" @click="createToken(inst.id)" :disabled="tokenLoading">Create token</button>
          </div>
        </li>
      </ul>
    </div>

    <div class="mapping-form">
      <h4>Mapping</h4>
      <label>Installation ID</label>
      <input type="text" v-model="mapping.installationId" />
      <label>Owner (org or user)</label>
      <input type="text" v-model="mapping.owner" />
      <label>Repository</label>
      <input type="text" v-model="mapping.repo" />
      <label>Base Branch</label>
      <input type="text" v-model="mapping.baseBranch" />

      <div class="mapping-actions">
        <button class="btn" @click="saveMapping" :disabled="saving">Save Mapping</button>
        <span v-if="saveMessage" class="muted">{{ saveMessage }}</span>
      </div>
    </div>

    <div v-if="tokenResult" class="token-box">
      <h4>Installation Token</h4>
      <pre>{{ tokenResult }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '../api/client'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()
const installations = ref([])
const loading = ref(false)
const tokenLoading = ref(false)
const tokenResult = ref(null)
const saving = ref(false)
const saveMessage = ref('')

const mapping = ref({
  installationId: settingsStore.profile.githubApp.installationId || '',
  owner: settingsStore.profile.githubApp.owner || '',
  repo: settingsStore.profile.githubApp.repo || '',
  baseBranch: settingsStore.profile.githubApp.baseBranch || 'main'
})

const fetchInstallations = async () => {
  loading.value = true
  tokenResult.value = null
  try {
    const res = await api.getGithubAppInstallations()
    installations.value = res.installations || []
  } catch (err) {
    console.warn('Failed to fetch installations', err)
    installations.value = []
  } finally {
    loading.value = false
  }
}

const selectInstallation = (inst) => {
  mapping.value.installationId = inst.id
  mapping.value.owner = inst.account?.login || mapping.value.owner
}

const createToken = async (installationId) => {
  tokenLoading.value = true
  tokenResult.value = null
  try {
    const res = await api.createGithubInstallationToken(installationId)
    tokenResult.value = res.token || JSON.stringify(res)
  } catch (err) {
    tokenResult.value = err?.message || 'Failed to create token'
  } finally {
    tokenLoading.value = false
  }
}

const saveMapping = async () => {
  saving.value = true
  saveMessage.value = ''
  try {
    settingsStore.profile.githubApp = {
      installationId: mapping.value.installationId || null,
      owner: mapping.value.owner || '',
      repo: mapping.value.repo || '',
      baseBranch: mapping.value.baseBranch || 'main'
    }
    await settingsStore.saveSettings()
    saveMessage.value = 'Saved'
    setTimeout(() => { saveMessage.value = '' }, 2000)
  } catch (err) {
    saveMessage.value = 'Save failed'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.github-app-onboard { background: var(--bg-secondary); padding: 16px; border-radius: 8px; border: 1px solid var(--border-color); }
.github-app-onboard h3 { margin: 0 0 8px 0 }
.muted { color: var(--text-secondary); font-size: 13px }
.actions { margin-bottom: 12px }
.install-list ul { list-style: none; padding: 0; margin: 0 0 12px 0 }
.inst-item { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border-color) }
.inst-main strong { display:block }
.inst-actions button { margin-left:8px }
.mapping-form label { display:block; margin-top:8px; font-weight:600 }
.mapping-form input { width:100%; padding:8px; margin-top:4px; border:1px solid var(--border-color); border-radius:6px }
.mapping-actions { margin-top:12px }
.token-box pre { background:#0b1220; color:#e6f1ff; padding:8px; border-radius:6px; overflow:auto }
</style>
