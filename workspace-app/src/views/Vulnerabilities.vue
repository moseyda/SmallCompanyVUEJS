<template>
  <div class="vulnerabilities-container">
    <!-- Header -->
    <div class="page-header">
      <h1>Vulnerabilities</h1>
      <p class="subtitle">Track and manage security vulnerabilities across your codebase</p>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="search-box">
        <span class="material-icons search-icon">search</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search vulnerabilities..."
          class="search-input"
        />
      </div>
      <div class="filters">
        <select v-model="filterStatus" class="filter-select">
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="fixed">Fixed</option>
          <option value="closed">Closed</option>
        </select>
        <select v-model="filterPriority" class="filter-select">
          <option value="">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div class="view-toggle">
        <button
          :class="['toggle-btn', { active: viewMode === 'list' }]"
          @click="viewMode = 'list'"
          title="List view"
        >
          <span class="material-icons">view_list</span>
        </button>
        <button
          :class="['toggle-btn', { active: viewMode === 'grid' }]"
          @click="viewMode = 'grid'"
          title="Grid view"
        >
          <span class="material-icons">grid_view</span>
        </button>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="summary-stats">
      <div class="stat-card critical">
        <div class="stat-icon">🔴</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.critical }}</div>
          <div class="stat-label">Critical</div>
        </div>
      </div>
      <div class="stat-card high">
        <div class="stat-icon">🟠</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.high }}</div>
          <div class="stat-label">High</div>
        </div>
      </div>
      <div class="stat-card medium">
        <div class="stat-icon">🟡</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.medium }}</div>
          <div class="stat-label">Medium</div>
        </div>
      </div>
      <div class="stat-card low">
        <div class="stat-icon">🟢</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.low }}</div>
          <div class="stat-label">Low</div>
        </div>
      </div>
    </div>

    <!-- Vulnerabilities List/Grid -->
    <div v-if="!loading" :class="['vulnerabilities-view', `view-${viewMode}`]">
      <div v-if="filteredVulnerabilities.length > 0" class="vulnerabilities-content">
        <div
          v-for="vuln in filteredVulnerabilities"
          :key="vuln.id"
          :class="['vulnerability-item', `priority-${vuln.priority}`]"
        >
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

          <p class="item-description">{{ vuln.description }}</p>

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

          <router-link :to="`/vulnerabilities/${vuln.id}`" class="item-link">
            View Details →
          </router-link>
        </div>
      </div>

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
  padding: 32px;
}

.page-header {
  margin-bottom: 28px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 20px;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
}

.filters {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
}

.view-toggle {
  display: flex;
  gap: 4px;
}

.toggle-btn {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-tertiary);
  }

  &.active {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
}

/* Summary Stats */
.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.stat-icon {
  font-size: 28px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Vulnerabilities View */
.vulnerabilities-view {
  display: flex;
  flex-direction: column;
}

.vulnerabilities-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.view-grid .vulnerabilities-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}

.vulnerability-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s;
}

.vulnerability-item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.vulnerability-item.priority-critical {
  border-left: 4px solid #dc2626;
}

.vulnerability-item.priority-high {
  border-left: 4px solid #ea580c;
}

.vulnerability-item.priority-medium {
  border-left: 4px solid #eab308;
}

.vulnerability-item.priority-low {
  border-left: 4px solid #22c55e;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}

.item-title-section {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
}

.vuln-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  line-height: 1.4;

  &:hover {
    color: var(--color-primary);
  }
}

.cve-badge {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  background: var(--bg-tertiary);
  padding: 4px 8px;
  border-radius: 4px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.item-badges {
  display: flex;
  gap: 8px;
}

.severity-badge,
.status-badge,
.priority-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
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

.item-description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: var(--text-secondary);
  padding: 12px 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;

  .material-icons {
    font-size: 16px;
  }

  &.related {
    color: var(--color-primary);
    font-weight: 600;
  }
}

.item-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 24px;
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
}

.large-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h2 {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.empty-state p {
  margin: 0 0 24px 0;
  font-size: 14px;
}

.action-btn {
  padding: 10px 20px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  color: var(--text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .vulnerabilities-container {
    padding: 24px;
  }

  .toolbar {
    flex-direction: column;
    gap: 12px;
  }

  .search-box {
    min-width: auto;
  }

  .view-grid .vulnerabilities-content {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 640px) {
  .vulnerabilities-container {
    padding: 16px;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .item-badges {
    flex-wrap: wrap;
  }

  .view-grid .vulnerabilities-content {
    grid-template-columns: 1fr;
  }
}
</style>
