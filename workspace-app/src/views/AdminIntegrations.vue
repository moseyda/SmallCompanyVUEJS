<template>
  <div class="admin-integrations page-wrap">
    <section class="glass panel">
      <h1>Admin — Integrations</h1>
      <p class="lead">Manage GitHub App installations and repository mappings used by the remediation automation.</p>
    </section>

    <section class="glass panel">
      <div class="panel-header-row">
        <h2>GitHub App Installations</h2>
        <div class="controls">
          <button class="btn" @click="fetchInstallations" :disabled="loading">Refresh</button>
          <span v-if="loading" class="muted">Loading...</span>
        </div>
      </div>

      <ul class="install-list">
        <li v-for="inst in installations" :key="inst.id" class="install-item">
          <div class="install-main">
            <strong>{{ inst.account?.login || inst.account?.name }}</strong>
            <small class="muted">ID: {{ inst.id }} • Repos: {{ inst.repository_selection }}</small>
          </div>
          <div class="install-actions">
            <button class="btn" @click="generateToken(inst.id)" :disabled="tokenLoading">Create Token</button>
            <button class="btn" @click="prefillMapping(inst)">Use mapping</button>
          </div>
        </li>
      </ul>

      <div v-if="generatedToken" class="token-box">
        <h4>Generated Token (temporary)</h4>
        <p class="muted">Copy and secure this token; it will not be stored by the UI.</p>
        <pre>{{ generatedToken }}</pre>
      </div>
    </section>

    <section class="glass panel">
      <h2>Repository Mappings</h2>
      <p class="muted">Mappings determine which installation/owner/repo the backend uses when creating PRs.</p>

      <div class="mapping-form">
        <label>Installation ID</label>
        <input v-model="mapping.installationId" />
        <label>Owner</label>
        <input v-model="mapping.owner" />
        <label>Repository</label>
        <input v-model="mapping.repo" />
        <label>Base Branch</label>
        <input v-model="mapping.baseBranch" />

        <div class="mapping-actions">
          <button class="btn" @click="addMapping" :disabled="saving">Add Mapping</button>
          <span v-if="saveMessage" class="muted">{{ saveMessage }}</span>
        </div>
      </div>

      <div class="mappings-list" v-if="mappings?.length">
        <h4>Saved Mappings</h4>
        <ul>
          <li v-for="(m, idx) in mappings" :key="idx" class="mapping-item">
            <div class="mapping-main">
              <strong>{{ m.owner }}/{{ m.repo }}</strong>
              <small class="muted">Installation: {{ m.installationId }} • Base: {{ m.baseBranch }}</small>
            </div>
            <div class="mapping-actions">
              <button class="btn secondary" @click="removeMapping(idx)">Remove</button>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api/client'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()
const installations = ref([])
const loading = ref(false)
const tokenLoading = ref(false)
const generatedToken = ref(null)
const saving = ref(false)
const saveMessage = ref('')

const mapping = ref({ installationId: '', owner: '', repo: '', baseBranch: 'main' })

const mappings = ref(settingsStore.profile.githubAppMappings || [])

const fetchInstallations = async () => {
  loading.value = true
  try {
    const res = await api.getGithubAppInstallations()
    installations.value = res.installations || []
  } catch (err) {
    console.warn('Unable to fetch installations', err)
  } finally {
    loading.value = false
  }
}

const generateToken = async (installationId) => {
  tokenLoading.value = true
  generatedToken.value = null
  try {
    const res = await api.createGithubInstallationToken(installationId)
    generatedToken.value = res.token || JSON.stringify(res)
  } catch (err) {
    generatedToken.value = err?.message || 'Failed to create token'
  } finally {
    tokenLoading.value = false
  }
}

const prefillMapping = (inst) => {
  mapping.value.installationId = inst.id
  mapping.value.owner = inst.account?.login || mapping.value.owner
}

const addMapping = async () => {
  saving.value = true
  saveMessage.value = ''
  try {
    const newMappings = [...(settingsStore.profile.githubAppMappings || []), { ...mapping.value }]
    const ok = await settingsStore.updateGithubAppMappings(newMappings)
    if (ok) {
      mappings.value = newMappings
      saveMessage.value = 'Saved'
      setTimeout(() => (saveMessage.value = ''), 2000)
      mapping.value = { installationId: '', owner: '', repo: '', baseBranch: 'main' }
    } else {
      saveMessage.value = 'Save failed'
    }
  } catch (err) {
    saveMessage.value = 'Save failed'
  } finally {
    saving.value = false
  }
}

const removeMapping = async (idx) => {
  const next = [...(settingsStore.profile.githubAppMappings || [])]
  next.splice(idx, 1)
  const ok = await settingsStore.updateGithubAppMappings(next)
  if (ok) mappings.value = next
}

onMounted(() => {
  fetchInstallations()
})
</script>

<style scoped>
.install-list, .mappings-list ul { list-style: none; padding: 0; margin: 0 }
.install-item, .mapping-item { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border-color) }
.muted { color: var(--text-secondary) }
.token-box pre { background:#0b1220; color:#e6f1ff; padding:8px; border-radius:6px }
.mapping-form input {
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

.mapping-form input:focus {
  outline: none;
  background: #ffffff;
  border-color: var(--brand-teal);
  box-shadow: 0 0 0 3px rgba(0, 167, 142, 0.08);
}
.mapping-actions { margin-top:8px }

.panel-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.panel-header-row h2 {
  margin: 0;
  font-size: 1.25rem;
}

.controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>


<style scoped>
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
}

.btn:hover {
  transform: translateY(-1px);
}

.btn.secondary,
.copy-btn {
  background: rgba(0, 167, 142, 0.12);
  color: #0f766e;
  border: 1px solid rgba(0, 167, 142, 0.4);
  border-radius: 999px;
  padding: 8px 16px;
}
</style>
