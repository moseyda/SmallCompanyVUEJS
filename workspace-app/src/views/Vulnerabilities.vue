<template>
  <div class="vulnerabilities-container">
    <!-- Header Section -->
    <div class="page-header">
      <h1>Vulnerabilities</h1>
      <p class="subtitle">Track and manage security vulnerabilities across your codebase</p>
    </div>

    <!-- Control Toolbar -->
    <div class="toolbar">
      <div class="search-box">
        <span class="material-icons search-icon">search</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search vulnerabilities..."
          class="search-input"
          aria-label="Search vulnerabilities"
        />
      </div>
      <div class="filters">
        <FilterDropdown
          v-model="filterStatus"
          :options="[
            { value: '', label: 'All Status' },
            { value: 'open', label: 'Open' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'fixed', label: 'Fixed' },
            { value: 'closed', label: 'Closed' }
          ]"
          label="Filter by status"
        />
        <FilterDropdown
          v-model="filterPriority"
          :options="[
            { value: '', label: 'All Priority' },
            { value: 'critical', label: 'Critical' },
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' }
          ]"
          label="Filter by priority"
        />
      </div>
      <div class="view-toggle" role="tablist" aria-label="View mode">
        <button
          :class="['toggle-btn', { active: viewMode === 'list' }]"
          @click="viewMode = 'list'"
          title="List view"
          role="tab"
          :aria-selected="viewMode === 'list'"
        >
          <span class="material-icons">view_list</span>
        </button>
        <button
          :class="['toggle-btn', { active: viewMode === 'grid' }]"
          @click="viewMode = 'grid'"
          title="Grid view"
          role="tab"
          :aria-selected="viewMode === 'grid'"
        >
          <span class="material-icons">grid_view</span>
        </button>
      </div>
    </div>

    <!-- Summary Statistics -->
    <div class="summary-stats">
      <div class="stat-card critical-card">
        <div class="stat-icon critical-icon">
          <span class="material-icons">error</span>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.critical }}</div>
          <div class="stat-label">Critical</div>
        </div>
      </div>
      <div class="stat-card high-card">
        <div class="stat-icon high-icon">
          <span class="material-icons">warning</span>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.high }}</div>
          <div class="stat-label">High</div>
        </div>
      </div>
      <div class="stat-card medium-card">
        <div class="stat-icon medium-icon">
          <span class="material-icons">info</span>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.medium }}</div>
          <div class="stat-label">Medium</div>
        </div>
      </div>
      <div class="stat-card low-card">
        <div class="stat-icon low-icon">
          <span class="material-icons">task_alt</span>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.low }}</div>
          <div class="stat-label">Low</div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="!loading" :class="['vulnerabilities-view', `view-${viewMode}`]">
      <!-- Vulnerabilities List/Grid -->
      <div v-if="filteredVulnerabilities.length > 0" class="vulnerabilities-content">
        <div
          v-for="vuln in filteredVulnerabilities"
          :key="vuln.id"
          :class="['vulnerability-item', `priority-${vuln.priority}`]"
        >
          <!-- Item Header with Title and Badges -->
          <div class="item-header">
            <div class="item-title-section">
              <router-link :to="`/vulnerabilities/${vuln.id}`" class="vuln-title">
                {{ vuln.title }}
              </router-link>
              <span class="cve-badge">{{ vuln.cveId }}</span>
            </div>
            <div class="item-badges">
              <span class="severity-badge" :class="`severity-${vuln.severity}`">
                {{ vuln.severity?.toUpperCase() }}
              </span>
              <span class="status-badge" :class="`status-${vuln.status}`">
                {{ formatStatus(vuln.status) }}
              </span>
              <span class="priority-badge" :class="`priority-${vuln.priority}`">
                {{ vuln.priority?.toUpperCase() }}
              </span>
            </div>
          </div>

          <!-- Item Description -->
          <p class="item-description">{{ vuln.description }}</p>

          <!-- Item Metadata -->
          <div class="item-meta">
            <span class="meta-item">
              <span class="material-icons">code</span>
              {{ vuln.affectedComponent }}
            </span>
            <span class="meta-item">
              <span class="material-icons">calendar_today</span>
              {{ formatDate(vuln.detectedDate) }}
            </span>
            <span v-if="vuln.relatedVulnerabilities?.length" class="meta-item related">
              <span class="material-icons">link</span>
              {{ vuln.relatedVulnerabilities.length }} Related
            </span>
          </div>

          <!-- Action Link -->
          <router-link :to="`/vulnerabilities/${vuln.id}`" class="item-link">
            View Details →
          </router-link>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <span class="material-icons large-icon">security</span>
        <h2>No vulnerabilities found</h2>
        <p>Adjust your filters or create a new scan to find vulnerabilities.</p>
        <button class="action-btn">Run New Scan</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="loading-state">
      <div class="spinner"></div>
      <p>Loading vulnerabilities...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useVulnerabilitiesStore } from '../stores/vulnerabilities'
import FilterDropdown from '../components/FilterDropdown.vue'

const vulnStore = useVulnerabilitiesStore()

const loading = ref(true)
const searchQuery = ref('')
const filterStatus = ref('')
const filterPriority = ref('')
const viewMode = ref('list')

const stats = computed(() => vulnStore.getSummaryStats)

const filteredVulnerabilities = computed(() => {
  let filtered = vulnStore.vulnerabilities

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(v =>
      v.title.toLowerCase().includes(query) ||
      v.description.toLowerCase().includes(query) ||
      v.cveId.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (filterStatus.value) {
    filtered = filtered.filter(v => v.status === filterStatus.value)
  }

  // Filter by priority
  if (filterPriority.value) {
    filtered = filtered.filter(v => v.priority === filterPriority.value)
  }

  // Sort by priority (critical first)
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
  return filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
})

onMounted(async () => {
  loading.value = true
  await vulnStore.loadVulnerabilities()
  loading.value = false
})

const formatStatus = (status) => {
  return status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now - d)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.vulnerabilities-container {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Header Section */
.page-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
}

.page-header h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 400;
}

/* Control Panel */
.toolbar {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  flex-wrap: wrap;
}

.search-box {
  flex: 0.35;
  min-width: 200px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 20px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 14px 10px 44px;
  border: 1px solid var(--line-strong);
  border-radius: 8px;
  background: var(--bg-quaternary);
  color: var(--ink-950);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &::placeholder {
    color: var(--text-secondary);
  }

  &:focus {
    outline: none;
    border-color: var(--brand-teal);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(0, 167, 142, 0.08);
  }
}

.filters {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.filters > * {
  flex: 1;
  min-width: 140px;
}

.filter-select {
  padding: 10px 12px 10px 14px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: #f0f2f5;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 18px;
  padding-right: 32px;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
}

.filter-select::-ms-expand {
  display: none;
}

.filter-select:hover {
  border-color: var(--color-primary);
  background-color: #eaecf0;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230066cc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
  background-color: #f0f2f5;
}

.filter-select:focus-visible {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.filter-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-select option {
  background: #ffffff;
  color: var(--text-primary);
  padding: 12px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
}

.filter-select option:checked {
  background: #f0f2f5;
  color: var(--color-primary);
  font-weight: 700;
}

.view-toggle {
  display: flex;
  gap: 6px;
  background: transparent;
  padding: 4px;
  border-radius: 8px;
  margin-left: auto;
}

.toggle-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;

  &:hover {
    color: var(--text-primary);
  }

  &.active {
    background: #f0f2f5;
    color: var(--color-primary);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
}

/* Summary Stats - Professional Grid */
.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
}

.stat-card:hover {
  border-color: var(--color-primary);
  background: var(--bg-primary);
}

.stat-icon {
  font-size: 32px;
  min-width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 10px;
}

.stat-icon .material-icons {
  font-size: 28px;
}

.critical-icon {
  background: rgba(220, 38, 38, 0.12);
  color: #dc2626;
}

.high-icon {
  background: rgba(234, 88, 12, 0.12);
  color: #ea580c;
}

.medium-icon {
  background: rgba(234, 179, 8, 0.12);
  color: #eab308;
}

.low-icon {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 600;
}

/* Content Area */
.vulnerabilities-view {
  display: flex;
  flex-direction: column;
}

.vulnerabilities-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.view-grid .vulnerabilities-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 16px;
}

/* Vulnerability Item Card */
.vulnerability-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 24px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
}

.vulnerability-item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.14);
  transform: translateY(-4px);
}

/* Item Header */
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.item-title-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.vuln-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
  line-height: 1.3;
  transition: color 0.2s;

  &:hover {
    color: var(--color-primary);
  }
}

.cve-badge {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  font-weight: 600;
  background: var(--bg-badge);
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--text-badge);
  white-space: nowrap;
  width: fit-content;
  letter-spacing: 0.5px;
}

.item-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.severity-badge,
.status-badge,
.priority-badge {
  padding: 5px 11px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.severity-badge {
  &.severity-critical {
    background: #fecaca;
    color: #991b1b;
  }
  &.severity-high {
    background: #fed7aa;
    color: #92400e;
  }
  &.severity-medium {
    background: #fef08a;
    color: #713f12;
  }
  &.severity-low {
    background: #dcfce7;
    color: #166534;
  }
}

.status-badge {
  &.status-open {
    background: #fee2e2;
    color: #991b1b;
  }
  &.status-in-progress {
    background: #fef3c7;
    color: #92400e;
  }
  &.status-fixed {
    background: #d1fae5;
    color: #065f46;
  }
  &.status-closed {
    background: #e5e7eb;
    color: #374151;
  }
}

.priority-badge {
  &.priority-critical {
    background: #fecaca;
    color: #991b1b;
  }
  &.priority-high {
    background: #fed7aa;
    color: #92400e;
  }
  &.priority-medium {
    background: #fef08a;
    color: #713f12;
  }
  &.priority-low {
    background: #dcfce7;
    color: #166534;
  }
}

/* Item Description */
.item-description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Item Meta */
.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: var(--text-secondary);
  padding: 14px 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;

  .material-icons {
    font-size: 16px;
    opacity: 0.6;
  }

  &.related {
    color: var(--color-primary);
    font-weight: 700;
  }
}

/* Item Link */
.item-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  align-self: flex-end;

  &:hover {
    gap: 8px;
  }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 24px;
  background: #ffffff;
  border: 2px dashed var(--border-color);
  border-radius: 10px;
  color: var(--text-secondary);
}

.large-icon {
  font-size: 56px;
  margin-bottom: 20px;
  opacity: 0.4;
}

.empty-state h2 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.empty-state p {
  margin: 0 0 28px 0;
  font-size: 14px;
  font-weight: 500;
}

.action-btn {
  padding: 12px 24px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.25);
  }
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  gap: 20px;
  color: var(--text-secondary);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .vulnerabilities-container {
    padding: 32px;
    gap: 28px;
  }

  .view-grid .vulnerabilities-content {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
}

@media (max-width: 768px) {
  .vulnerabilities-container {
    padding: 24px;
    gap: 24px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .toolbar {
    flex-direction: column;
    gap: 12px;
  }

  .search-box {
    min-width: auto;
    width: 100%;
  }

  .filters {
    width: 100%;
    gap: 8px;
  }

  .filter-select {
    flex: 1;
  }

  .view-toggle {
    width: 100%;
    justify-content: center;
    margin-left: 0;
  }

  .vulnerability-item {
    padding: 20px;
  }

  .view-grid .vulnerabilities-content {
    grid-template-columns: 1fr;
  }

  .item-header {
    flex-direction: column;
  }

  .item-meta {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .vulnerabilities-container {
    padding: 16px;
    gap: 20px;
  }

  .page-header {
    padding-bottom: 16px;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 13px;
  }

  .toolbar {
    padding: 16px;
  }

  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-icon {
    font-size: 28px;
  }

  .stat-value {
    font-size: 22px;
  }

  .vulnerability-item {
    padding: 16px;
    gap: 12px;
  }

  .vuln-title {
    font-size: 15px;
  }

  .item-badges {
    gap: 6px;
  }

  .severity-badge,
  .status-badge,
  .priority-badge {
    padding: 4px 8px;
    font-size: 10px;
  }
}
</style>
