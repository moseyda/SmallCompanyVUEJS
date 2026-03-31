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
          <pre><code>{{ remediation.beforeCode }}</code></pre>
        </div>
        <div class="comparison-arrow">→</div>
        <div class="code-pane after">
          <div class="pane-header">
            <span>After Fix</span>
            <span class="badge success">Secure</span>
          </div>
          <pre><code>{{ remediation.afterCode }}</code></pre>
        </div>
      </div>
    </div>

    <!-- Merge Request Integration -->
    <div class="merge-request-section">
      <h3>Merge Request Integration</h3>
      <div class="merge-config">
        <div class="config-item">
          <label>Platform:</label>
          <span>{{ remediation.mergeRequestIntegration?.platform || 'GitHub' }}</span>
        </div>
        <div class="config-item">
          <label>Auto-Create PR:</label>
          <toggle-switch
            :value="remediation.mergeRequestIntegration?.autoCreate || false"
            @change="(val) => updateMergeConfig('autoCreate', val)"
          />
        </div>
      </div>

      <div v-if="remediation.pullRequests?.length" class="pull-requests-list">
        <h4>Created Merge Requests</h4>
        <div v-for="pr in remediation.pullRequests" :key="pr.id" class="pr-item">
          <div class="pr-header">
            <a :href="pr.url" target="_blank" class="pr-link">
              Pull Request #{{ pr.id.split('-').pop() }}
              <span class="external-icon">↗</span>
            </a>
            <span class="pr-status" :class="`pr-${pr.status}`">
              {{ pr.status.charAt(0).toUpperCase() + pr.status.slice(1) }}
            </span>
          </div>
          <p class="pr-date">Created {{ formatDate(pr.createdDate) }}</p>
        </div>
      </div>

      <div v-if="remediation.status === 'in-progress'" class="merge-actions">
        <input
          v-model="branchName"
          type="text"
          placeholder="feature/fix-sql-injection"
          class="branch-input"
        />
        <button class="action-btn" @click="createMergeRequest">
          Create Merge Request
        </button>
      </div>
    </div>

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
import { ref, defineProps, defineEmits } from 'vue'
import { useVulnerabilitiesStore } from '../stores/vulnerabilities'
import ToggleSwitch from './ToggleSwitch.vue'
import { ClockIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  vulnId: String,
  remediation: Object
})

const emit = defineEmits(['apply-fix'])

const vulnStore = useVulnerabilitiesStore()

const branchName = ref('feature/fix-vulnerability')

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

const proposeRemediation = () => {
  vulnStore.remediations[props.vulnId].status = 'proposed'
}

const startRemediation = () => {
  vulnStore.remediations[props.vulnId].status = 'in-progress'
}

const createMergeRequest = async () => {
  if (!branchName.value.trim()) {
    alert('Please enter a branch name')
    return
  }
  const applied = await vulnStore.createMergeRequest(props.vulnId, 'fix-001', branchName.value)
  if (applied) {
    branchName.value = 'feature/fix-vulnerability'
  }
}

const updateMergeConfig = (key, value) => {
  if (props.remediation?.mergeRequestIntegration) {
    props.remediation.mergeRequestIntegration[key] = value
  }
}
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
  background: linear-gradient(135deg, var(--brand-teal), #14c0a8);
  color: white;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 800;
  box-shadow: 0 6px 18px rgba(0, 167, 142, 0.12);
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

.empty-state p {
  margin: 0 0 12px 0;
}

/* Comparison Section */
.comparison-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 24px;
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
  align-items: center;
}

.code-pane {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pane-header {
  background: var(--bg-primary);
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

.code-pane pre {
  margin: 0;
  padding: 16px;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: auto;
  flex: 1;
}

.code-pane code {
  color: var(--text-primary);
  font-family: 'Courier New', monospace;
}

.comparison-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--text-secondary);
  padding: 0 8px;
}

/* Merge Request Section */
.merge-request-section {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 24px;
}

.merge-request-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.merge-config {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
