<template>
  <div class="page-wrap">
    <section class="glass panel">
      <h1>Scan Results & Vulnerabilities</h1>
      <p class="lead">Active scan results with severity levels. Prioritize and remediate issues.</p>
      <div class="filter-row">
        <button
          v-for="status in statuses"
          :key="status"
          class="btn"
          :class="activeStatus === status ? 'btn-primary' : 'btn-secondary'"
          @click="activeStatus = status"
        >
          {{ status }}
        </button>
      </div>
    </section>

    <section class="card-list">
      <article class="card-item" v-for="project in visibleProjects" :key="project.name">
        <div class="card-header">
          <span class="severity-badge" :class="project.risk_level.toLowerCase()">
            {{ project.risk_level }}
          </span>
          <p class="meta">{{ project.status }}</p>
        </div>
        <h2>{{ project.name }}</h2>
        <p class="detail">{{ project.summary }}</p>
        <div class="issue-breakdown">
          <span class="issue-badge">{{ project.issues }} Total Issues</span>
          <span class="last-scan">{{ project.last_scan }}</span>
        </div>
        <p class="impact">{{ project.impact }}</p>
        <button class="btn btn-action">View Issues & Fix</button>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '../stores/workspace'

const statuses = ['All', 'Critical', 'High', 'Medium', 'Low']
const activeStatus = ref('All')
const workspaceStore = useWorkspaceStore()
const { projects } = storeToRefs(workspaceStore)

onMounted(() => {
  workspaceStore.fetchProjects()
})

const visibleProjects = computed(() => {
  if (activeStatus.value === 'All') {
    return projects.value
  }

  return projects.value.filter((project) => project.risk_level === activeStatus.value)
})
</script>

<style scoped>
h1 {
  font-size: clamp(1.6rem, 3.4vw, 2.7rem);
  margin-bottom: 0.7rem;
}

.filter-row {
  margin-top: 1rem;
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.severity-badge {
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.severity-badge.critical {
  background-color: #fecaca;
  color: #7f1d1d;
}

.severity-badge.high {
  background-color: #fed7aa;
  color: #92400e;
}

.severity-badge.medium {
  background-color: #fde047;
  color: #713f12;
}

.severity-badge.low {
  background-color: #dcfce7;
  color: #166534;
}

.meta {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-600);
}

h2 {
  margin-top: 0.6rem;
  font-size: 1.3rem;
}

.detail {
  margin-top: 0.45rem;
  color: var(--ink-600);
}

.issue-breakdown {
  margin-top: 0.8rem;
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.issue-badge {
  padding: 0.3rem 0.6rem;
  background: var(--surface-subtle);
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.last-scan {
  padding: 0.3rem 0.6rem;
  background: var(--surface-subtle);
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--ink-600);
}

.impact {
  margin-top: 0.6rem;
  font-weight: 650;
  color: var(--ink-800);
}

.btn-action {
  margin-top: 0.6rem;
  padding: 0.6rem 1rem;
  background: var(--brand-teal);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-action:hover {
  opacity: 0.9;
}
</style>
</style>
