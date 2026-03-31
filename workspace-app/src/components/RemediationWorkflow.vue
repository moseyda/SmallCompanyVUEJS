<template>
  <div class="remediation-workflow">
    <!-- Progress Tracking -->
    <div class="progress-section">
      <h3 class="progress-heading">
        <span>Remediation Progress</span>
        <span class="progress-heading-value">{{ Math.round(remediation.progress || 0) }}%</span>
      </h3>
      <div
        class="progress-bar"
        role="progressbar"
        :aria-valuenow="remediation.progress || 0"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${remediation.progress || 0}%` }"></div>
        </div>
      </div>
    </div>

    <!-- Status Overview -->
    <div class="status-section">
      <div class="status-item">
        <label>Current Status:</label>
        <span class="status-badge" :class="`status-${remediation.status}`">
          {{ formatStatus(remediation.status) }}
        </span>
      </div>
      <button v-if="remediation.status === 'draft'" class="action-btn" @click="proposeRemediation">
        Propose Remediation
      </button>
      <button v-else-if="remediation.status === 'proposed'" class="action-btn" @click="startRemediation">
        Start Remediation
      </button>
    </div>

    <!-- Suggested Fixes -->
    <div class="fixes-section">
      <h3>Suggested Fixes</h3>
      <div v-if="remediation.suggestedFixes?.length" class="fixes-list">
        <div
          v-for="(fix, idx) in remediation.suggestedFixes"
          :key="fix.id"
          class="fix-option"
        >
          <div class="fix-header">
            <h4>
              <span class="fix-badge">{{ String.fromCharCode(65 + idx) }}</span>
              {{ fix.title }}
            </h4>
            <div class="fix-meta">
              <span :class="['complexity-badge', `complexity-${fix.complexity}`]">{{ fix.complexity }}</span>
              <span class="confidence-badge">{{ Math.round(fix.confidence * 100) }}% confidence</span>
            </div>
          </div>

          <p class="fix-description">{{ fix.description }}</p>
          <div class="fix-details">
            <span class="detail-item">
              <ClockIcon class="fix-icon" aria-hidden="true" />
              <span>Est. Time: {{ fix.estimatedTime }}</span>
            </span>
          </div>
          <button class="action-btn" @click="applySuggestion(fix)">
            Apply This Fix
          </button>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>No suggestions yet. Contact AI for automated recommendations.</p>
        <button class="action-btn">Generate Suggestions</button>
      </div>
    </div>

    <!-- Before/After Comparison -->
    <div v-if="remediation.beforeCode || remediation.afterCode" class="comparison-section">
      <h3>Code Comparison</h3>
      <div class="code-comparison">
        <div class="code-pane before">
          <div class="pane-header">
            <span>Before Fix</span>
            <span class="badge warning">Has Vulnerability</span>
          </div>
          <div class="code-lines" aria-label="Before code">
            <div
              v-for="(line, idx) in beforeLines"
              :key="idx"
              :class="['code-line', line.status]"
            >
              <span class="ln">{{ idx + 1 }}</span>
              <code>{{ line.text }}</code>
            </div>
          </div>
        </div>

        <div class="comparison-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path>
            <path d="M13 5l7 7-7 7"></path>
          </svg>
        </div>

        <div class="code-pane after">
          <div class="pane-header">
            <span>After Fix</span>
            <span class="badge success">Secure</span>
          </div>
          <div class="code-lines" aria-label="After code">
            <div
              v-for="(line, idx) in afterLines"
              :key="idx"
              :class="['code-line', line.status]"
            >
              <span class="ln">{{ idx + 1 }}</span>
              <code>{{ line.text }}</code>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Merge Request Integration -->
    <article class="glass panel merge-request-section">
      <h2 class="section-title">Merge Request Integration</h2>

      <div class="merge-config">
        <div class="config-item">
          <label>Platform:</label>
          <div class="platform-select">
            <FilterDropdown v-model="selectedPlatform" :options="platformOptions" label="Platform" />
          </div>
        </div>

        <div class="config-item">
          <label>Repository Mapping:</label>
          <div class="mapping-select">
            <FilterDropdown v-model="selectedMappingIndex" :options="mappingOptions" label="Repository Mapping" />
          </div>
        </div>

        <div class="config-item">
          <label>Auto-Create PR:</label>
          <div>
            <toggle-switch
              :value="remediation.mergeRequestIntegration?.autoCreate || false"
              @change="(val) => updateMergeConfig('autoCreate', val)"
            />
          </div>
        </div>
      </div>

      <div v-if="!mappings.length" class="no-mappings-hint">
        <p class="muted">No repository mappings found. Admins can add mappings in <router-link to="/admin/integrations">Admin → Integrations</router-link>.</p>
      </div>

      <div v-if="remediation.pullRequests?.length" class="pull-requests-list">
        <h4>Created Merge Requests</h4>

        <div class="pr-filter-row">
          <label>
            Status:
            <select v-model="statusFilter">
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="merged">Merged</option>
              <option value="in-progress">In Progress</option>
              <option value="proposed">Proposed</option>
              <option value="draft">Draft</option>
            </select>
          </label>
        </div>

        <div class="table-wrap">
          <table class="pr-table">
            <thead>
              <tr>
                <th>PR</th>
                <th>
                  <button class="sort-btn" @click="setSort('createdDate')">
                    Created
                    <span v-if="sortField === 'createdDate'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                  </button>
                </th>
                <th>
                  <button class="sort-btn" @click="setSort('status')">
                    Status
                    <span v-if="sortField === 'status'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
                  </button>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pr in filteredPullRequests" :key="pr.id">
                <td>
                  <a :href="pr.url" target="_blank" class="pr-link" :title="pr.url">
                    #{{ pr.id.split('-').pop() }} <span class="external-icon">↗</span>
                  </a>
                </td>
                <td>{{ formatDate(pr.createdDate) }}</td>
                <td><span class="pr-status" :class="`pr-${pr.status}`">{{ formatStatus(pr.status) }}</span></td>
                <td class="pr-actions-cell">
                  <button class="btn copy-btn" @click="copyToClipboard(pr.url)" :title="`Copy ${pr.url}`">Copy</button>
                  <a :href="pr.url" target="_blank" class="btn open-btn" :title="`Open ${pr.url}`">Open</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="remediation.status === 'in-progress'" class="merge-actions">
        <div class="branch-group">
          <input
            v-model="branchName"
            type="text"
            placeholder="feature/fix-sql-injection"
            class="branch-input"
            :disabled="mrCreating"
          />
          <button class="btn copy-btn" @click="copyToClipboard(branchName)">Copy</button>
        </div>

        <div class="create-group">
          <button class="action-btn" @click="createMergeRequest" :disabled="mrCreating">
            <span v-if="mrCreating" class="mr-spinner" aria-hidden="true"></span>
            <span v-if="!mrCreating">Create Merge Request</span>
            <span v-else>Creating...</span>
          </button>
        </div>
      </div>

      <div v-if="createSuccess" class="mr-status-message success">{{ createSuccess }}</div>
      <div v-if="createError" class="mr-status-message error">{{ createError }}</div>
    </article>

    <!-- Remediation Timeline -->
    <div class="timeline-section">
      <h3>Timeline</h3>
      <div class="timeline">
        <div class="timeline-item completed">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h4>Vulnerability Detected</h4>
            <p>{{ formatDate(new Date()) }}</p>
          </div>
        </div>
        <div v-if="remediation.status !== 'draft'" class="timeline-item completed">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h4>Remediation Proposed</h4>
            <p>awaiting decision...</p>
          </div>
        </div>
        <div v-if="remediation.status === 'in-progress'" class="timeline-item in-progress">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h4>Remediation In Progress</h4>
            <p>Fix being implemented...</p>
          </div>
        </div>
        <div :class="['timeline-item', { completed: remediation.status === 'completed' }]">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h4>Vulnerab Resolved</h4>
            <p v-if="remediation.status === 'completed'">{{ formatDate(new Date()) }}</p>
            <p v-else>Awaiting completion...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, watch, onMounted } from 'vue'
import { useVulnerabilitiesStore } from '../stores/vulnerabilities'
import { useSettingsStore } from '../stores/settings'
import ToggleSwitch from './ToggleSwitch.vue'
import FilterDropdown from './FilterDropdown.vue'
import { ClockIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  vulnId: String,
  remediation: Object
})

const emit = defineEmits(['apply-fix'])

const vulnStore = useVulnerabilitiesStore()
const settingsStore = useSettingsStore()

const branchName = ref('feature/fix-vulnerability')
const platforms = ['GitHub', 'GitLab', 'Bitbucket']
const platformOptions = computed(() => platforms.map(p => ({ label: p, value: p })))
const normalizePlatform = (p) => {
  if (!p) return null
  const key = p.toString().toLowerCase()
  if (key === 'github' || key === 'gh') return 'GitHub'
  if (key === 'gitlab') return 'GitLab'
  if (key === 'bitbucket') return 'Bitbucket'
  return p
}

const selectedPlatform = ref(normalizePlatform(props.remediation?.mergeRequestIntegration?.platform) || 'GitHub')
const mrCreating = ref(false)
const createError = ref(null)
const createSuccess = ref(null)
const mappings = computed(() => settingsStore.profile.githubAppMappings || [])
const mappingOptions = computed(() => {
  const out = [{ label: 'Manual / None', value: '-1' }];
  (mappings.value || []).forEach((m, idx) => {
    out.push({ label: `${m.owner}/${m.repo} (inst ${m.installationId})`, value: String(idx) })
  })
  return out
})

const selectedMappingIndex = ref('-1')
const statusFilter = ref('all')
const sortField = ref('createdDate')
const sortDirection = ref('desc')

const filteredPullRequests = computed(() => {
  const base = (props.remediation?.pullRequests || []).filter((pr) => {
    if (statusFilter.value === 'all') return true
    return pr.status === statusFilter.value
  })

  const sorted = [...base].sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]

    if (sortField.value === 'createdDate') {
      aVal = new Date(aVal || '')
      bVal = new Date(bVal || '')
    } else if (sortField.value === 'status') {
      aVal = String(aVal || '').toLowerCase()
      bVal = String(bVal || '').toLowerCase()
    }

    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })

  return sorted
})

const setSort = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'desc'
  }
}

const formatStatus = (status) => {
  const map = { draft: 'Draft', proposed: 'Proposed', 'in-progress': 'In Progress', completed: 'Completed' }
  return map[status] || status
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const applySuggestion = (fix) => {
  // Prepare fix for application based on configuration
  emit('apply-fix', { fixId: fix.id, branchName: branchName.value })
}

const proposeRemediation = async () => {
  try {
    await vulnStore.updateRemediation(props.vulnId, { status: 'proposed' })
  } catch (e) {
    console.warn('Failed to set remediation to proposed', e)
  }
}

const startRemediation = async () => {
  try {
    await vulnStore.updateRemediation(props.vulnId, { status: 'in-progress' })
  } catch (e) {
    console.warn('Failed to start remediation', e)
  }
}

const createMergeRequest = async () => {
  if (!branchName.value.trim()) {
    createError.value = 'Please enter a branch name'
    createSuccess.value = null
    return
  }

  mrCreating.value = true
  createError.value = null
  createSuccess.value = null

  // Persist selected platform before creating MR
  try {
    await vulnStore.updateRemediation(props.vulnId, {
      mergeRequestIntegration: props.remediation.mergeRequestIntegration || { platform: selectedPlatform.value }
    })
  } catch (e) {
    // non-fatal, proceed but surface a warning
    console.warn('Failed to persist merge config before MR creation', e)
  }

  // prefer first suggested fix id if available
  const fixIdForCreate = props.remediation?.suggestedFixes?.[0]?.id || 'fix-001'
  try {
    const applied = await vulnStore.createMergeRequest(props.vulnId, fixIdForCreate, branchName.value, selectedPlatform.value)
    if (applied) {
      createSuccess.value = 'Merge request created successfully.'
      // reset branch field to default after success
      branchName.value = 'feature/fix-vulnerability'
      // clear success message after a short delay
      setTimeout(() => { createSuccess.value = null }, 3500)
    } else {
      createError.value = vulnStore.error || 'Failed to create merge request.'
    }
  } catch (err) {
    createError.value = err?.message || 'Failed to create merge request.'
  } finally {
    mrCreating.value = false
  }
}

const copyToClipboard = async (text) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    createSuccess.value = 'Copied to clipboard.'
    setTimeout(() => { createSuccess.value = null }, 1800)
  } catch (e) {
    createError.value = 'Unable to copy to clipboard.'
    setTimeout(() => { createError.value = null }, 2400)
  }
}

watch(selectedPlatform, (val) => {
  updateMergeConfig('platform', val)
})

// Ensure a mergeRequestIntegration object exists and persist updates in a single call
const updateMergeConfig = async (key, value) => {
  const current = props.remediation?.mergeRequestIntegration ? { ...props.remediation.mergeRequestIntegration } : { platform: selectedPlatform.value }
  current[key] = value
  // reflect locally for immediate UI feedback
  if (props.remediation) props.remediation.mergeRequestIntegration = current
  try {
    await vulnStore.updateRemediation(props.vulnId, { mergeRequestIntegration: current })
  } catch (e) {
    console.warn('Failed to persist mergeRequestIntegration', e)
  }
}

// Apply a selected mapping (single API call)
const applySelectedMapping = async (idx) => {
  const n = Number(idx)
  if (Number.isFinite(n) && n >= 0 && mappings.value[n]) {
    const m = mappings.value[n]
    const current = { ...(props.remediation?.mergeRequestIntegration || {}), installationId: m.installationId, owner: m.owner, repo: m.repo, baseBranch: m.baseBranch || 'main' }
    if (props.remediation) props.remediation.mergeRequestIntegration = current
    try {
      await vulnStore.updateRemediation(props.vulnId, { mergeRequestIntegration: current })
    } catch (e) {
      console.warn('Failed to save mapping selection', e)
    }
  } else {
    // clear mapping fields
    const current = { ...(props.remediation?.mergeRequestIntegration || {}), installationId: null, owner: '', repo: '', baseBranch: 'main' }
    if (props.remediation) props.remediation.mergeRequestIntegration = current
    try {
      await vulnStore.updateRemediation(props.vulnId, { mergeRequestIntegration: current })
    } catch (e) {
      console.warn('Failed to clear mapping selection', e)
    }
  }
}

// keep selectedMappingIndex in sync when settings or remediation change
watch([() => mappings.value, () => props.remediation?.mergeRequestIntegration], () => {
  const remMap = props.remediation?.mergeRequestIntegration || {}
  const idx = mappings.value.findIndex(m => String(m.installationId) === String(remMap.installationId) || (m.owner === remMap.owner && m.repo === remMap.repo))
  selectedMappingIndex.value = idx >= 0 ? String(idx) : '-1'
}, { immediate: true })

watch(selectedMappingIndex, (val) => {
  applySelectedMapping(val)
})

onMounted(() => {
  if (!settingsStore.loaded) settingsStore.fetchSettings().catch(() => {})
})

// Compute simple line-by-line comparison arrays for before/after panes.
const beforeLines = computed(() => {
  const before = String(props.remediation?.beforeCode || '')
  const after = String(props.remediation?.afterCode || '')
  const bLines = before.split('\n')
  const aLines = after.split('\n')
  const max = Math.max(bLines.length, aLines.length)
  const out = []
  for (let i = 0; i < max; i++) {
    const bl = bLines[i] ?? ''
    const al = aLines[i] ?? ''
    if (bl === al) out.push({ text: bl, status: 'unchanged' })
    else out.push({ text: bl, status: bl ? 'removed' : 'empty' })
  }
  return out
})

const afterLines = computed(() => {
  const before = String(props.remediation?.beforeCode || '')
  const after = String(props.remediation?.afterCode || '')
  const bLines = before.split('\n')
  const aLines = after.split('\n')
  const max = Math.max(bLines.length, aLines.length)
  const out = []
  for (let i = 0; i < max; i++) {
    const bl = bLines[i] ?? ''
    const al = aLines[i] ?? ''
    if (bl === al) out.push({ text: al, status: 'unchanged' })
    else out.push({ text: al, status: al ? 'added' : 'empty' })
  }
  return out
})
</script>

<style scoped>
.remediation-workflow {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Progress Section */
.progress-section {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(13,29,45,0.06);
}

.progress-section h3 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress-bar {
  position: relative;
  height: 32px;
  margin-bottom: 8px;
}

.progress-track {
  height: 12px;
  background: #eef3f6;
  border-radius: 999px;
  overflow: hidden;
  margin: 10px 0;
}

.progress-fill {
  height: 100%;
  width: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--brand-teal), #14c0a8);
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
}

.progress-fill::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 8px, rgba(255,255,255,0.02) 8px 16px);
  mix-blend-mode: overlay;
  background-size: 200% 100%;
  animation: progress-stripes 2s linear infinite;
}

@keyframes progress-stripes {
  from { background-position: 0 0; }
  to { background-position: -48px 0; }
}

.progress-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress-heading-value {
  font-weight: 800;
  font-size: 13px;
  color: var(--brand-teal);
}

/* Status Section */
.status-section {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 6px 18px rgba(13,29,45,0.04);
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-item label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;

  &.status-draft {
    background: #e5e7eb;
    color: #374151;
  }
  &.status-proposed {
    background: #fef3c7;
    color: #92400e;
  }
  &.status-in-progress {
    background: #bfdbfe;
    color: #1e40af;
  }
  &.status-completed {
    background: #d1fae5;
    color: #065f46;
  }
}

/* Action Button */
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.55rem 1rem;
  background: linear-gradient(125deg, var(--brand-teal), #14c0a8);
  color: #ffffff;
  border: none;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(0, 167, 142, 0.12);
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  opacity: 0.95;
  box-shadow: 0 10px 30px rgba(0, 167, 142, 0.16);
}

/* Fixes Section */
.fixes-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 24px;
}

.fixes-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.fixes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fix-option {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 18px;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
  box-shadow: 0 6px 18px rgba(13,29,45,0.04);
}

.fix-option:hover {
  border-color: var(--color-primary);
  box-shadow: 0 10px 30px rgba(13,29,45,0.06);
}

.fix-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.fix-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.fix-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--btn-secondary-bg-start), var(--btn-secondary-bg-end));
  color: #132033;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 800;
  box-shadow: 0 6px 18px rgba(149,111,83,0.12);
}

/* Use the app's secondary button gold for all option badges */
.fixes-list .fix-option .fix-badge {
  background: linear-gradient(135deg, var(--btn-secondary-bg-start), var(--btn-secondary-bg-end));
}

.fix-meta {
  display: flex;
  gap: 8px;
}

.complexity-badge {
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;

  &.complexity-low {
    background: #dcfce7;
    color: #166534;
  }
  &.complexity-medium {
    background: #fef08a;
    color: #713f12;
  }
  &.complexity-high {
    background: #fed7aa;
    color: #92400e;
  }
}

.confidence-badge {
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.fix-description {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.fix-details {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--text-secondary);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.fix-icon {
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.empty-state {
  text-align: center;
  padding: 24px;
  color: var(--text-secondary);
}

/* Make action buttons inside suggested-fix cards match the compact sizing used in issue cards */
.fixes-list .action-btn {
  padding: 0.42rem 0.7rem;
  font-size: 0.78rem;
  gap: 0.25rem;
  box-shadow: 0 3px 8px rgba(0, 167, 142, 0.14);
  min-height: 34px;
}

.fixes-list .action-btn.secondary {
  box-shadow: 0 3px 8px rgba(149, 111, 83, 0.12);
}

.empty-state p {
  margin: 0 0 12px 0;
}

/* Comparison Section */
.comparison-section {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.comparison-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.code-comparison {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: stretch;
}

.code-pane {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pane-header {
  background: var(--surface);
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.badge {
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;

  &.warning {
    background: #fecaca;
    color: #991b1b;
  }
  &.success {
    background: #d1fae5;
    color: #065f46;
  }
}

.code-lines {
  max-height: 320px;
  overflow: auto;
}

.code-line {
  display: flex;
  gap: 12px;
  padding: 6px 12px;
  font-size: 13px;
  align-items: flex-start;
  white-space: pre;
}

.code-line .ln {
  width: 40px;
  text-align: right;
  color: var(--text-secondary);
  font-family: 'Courier New', monospace;
  padding-right: 12px;
  user-select: none;
}

.code-line.unchanged {
  background: transparent;
}

.code-line.removed {
  background: rgba(254, 226, 226, 0.6);
  border-left: 4px solid #fecaca;
  color: #991b1b;
}

.code-line.added {
  background: rgba(209, 250, 229, 0.6);
  border-left: 4px solid #34d399;
  color: #065f46;
}

.code-line.empty {
  background: transparent;
  color: var(--text-secondary);
}

.code-line code {
  display: block;
  flex: 1;
  color: inherit;
  font-family: 'Courier New', monospace;
  white-space: pre;
}

.comparison-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}

.comparison-arrow svg {
  width: 36px;
  height: 36px;
  color: var(--text-secondary);
  opacity: 0.9;
}


/* Merge Request Section */
.merge-request-section {
  /* Use `glass panel` for the outer card; keep internal spacing minimal but consistent. */
  /* No explicit padding override so the global .panel padding applies. */
}

.merge-request-section .section-title {
  margin: 0 0 12px 0;
}

.merge-config {
  padding-top: 8px;
  display: grid;
  /* Responsive two-column layout with sensible minimum column width */
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 8px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.config-item label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.config-item span {
  font-size: 13px;
  color: var(--text-primary);
}

.pull-requests-list {
  margin-bottom: 16px;
}

.pull-requests-list h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
}

.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--line-soft);
  border-radius: 10px;
  background: var(--surface-soft);
}

.pr-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 520px;
}

.pr-table th,
.pr-table td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--line-soft);
  font-size: 13px;
}

.pr-table th {
  color: var(--text-secondary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: rgba(238, 243, 247, 0.85);
}

.pr-table tbody tr:hover {
  background: rgba(240, 242, 245, 0.8);
}

.pr-link {
  color: var(--color-primary);
  font-weight: 600;
}

.pr-actions-cell {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.platform-select select,
.mapping-select select,
.merge-config select {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--surface-strong);
  color: var(--text-primary);
  -webkit-appearance: none;
  appearance: none;
}

.platform-select,
.mapping-select {
  max-width: 290px;
  width: 100%;
  display: block;
}

.config-item label {
  display: inline-block;
  margin-right: 12px;
  flex: 0 0 auto;
  white-space: nowrap;
}

.config-item > div {
  flex: 1 1 auto;
  min-width: 0;
}

.pr-item {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pr-header {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
}

.pr-actions {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.pr-filter-row {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
}

.pr-filter-row select {
  margin-left: 8px;
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--surface-strong);
}

.sort-btn {
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.sort-btn:hover {
  color: var(--color-primary);
}

.btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  font-weight: 600;
}

.btn.open-btn {
  background: linear-gradient(125deg, var(--brand-teal), #14c0a8);
  color: #fff;
  border: none;
}

.copy-btn {
  background: transparent;
}

.branch-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.create-group {
  margin-top: 8px;
}

.mr-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.18);
  border-top-color: #fff;
  margin-right: 8px;
  animation: mr-spin 0.9s linear infinite;
}

@keyframes mr-spin {
  to { transform: rotate(360deg); }
}

.mr-status-message {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  font-weight: 600;
}

.mr-status-message.success {
  background: rgba(34,197,94,0.12);
  color: #065f46;
}

.mr-status-message.error {
  background: rgba(254,202,202,0.12);
  color: #991b1b;
}

.pr-item {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
}

.pr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.pr-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
}

.external-icon {
  font-size: 10px;
  opacity: 0.7;
}

.pr-status {
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;

  &.pr-draft {
    background: #e5e7eb;
    color: #374151;
  }
  &.pr-open {
    background: #bfdbfe;
    color: #1e40af;
  }
  &.pr-merged {
    background: #d1fae5;
    color: #065f46;
  }
}

.pr-date {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 4px 0 0 0;
}

.no-mappings-hint {
  grid-column: 1 / -1;
  margin: 16px 0;
  padding: 12px 20px;
  background: rgba(240, 242, 245, 0.9);
  border: 1px solid var(--line-soft);
  border-radius: 10px;
  text-align: center;
}

.no-mappings-hint .muted {
  color: var(--text-secondary);
  font-size: 13px;
  margin: 0;
}

.merge-actions {
  display: flex;
  gap: 8px;
}

.branch-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 13px;
  background: #f3f6f7;
  color: var(--text-primary);
  font-family: 'Courier New', monospace;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 6px 18px rgba(var(--color-primary-rgb), 0.08);
  }
}

/* Timeline Section */
.timeline-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 24px;
}

.timeline-section h3 {
  margin: 0 0 24px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.timeline {
  position: relative;
  padding-left: 32px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border-color);
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.timeline-dot {
  position: absolute;
  left: -27px;
  top: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--border-color);
  border: 2px solid var(--bg-secondary);
  transition: all 0.2s;
}

.timeline-item.completed .timeline-dot {
  background: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb), 0.1);
}

.timeline-item.in-progress .timeline-dot {
  background: var(--color-primary);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb), 0.7); }
  50% { box-shadow: 0 0 0 6px rgba(var(--color-primary-rgb), 0); }
}

.timeline-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.timeline-content p {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .code-comparison {
    grid-template-columns: 1fr;
  }

  .comparison-arrow {
    transform: rotate(90deg);
  }

  .merge-config {
    grid-template-columns: 1fr;
  }
}
</style>
