<template>
  <div class="page-wrap">
    <section class="glass panel">
      <h1>Delivery Workstream</h1>
      <p class="lead">Track active initiatives by stage and expected impact.</p>
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
        <p class="meta">{{ project.status }} • {{ project.sector }}</p>
        <h2>{{ project.name }}</h2>
        <p class="detail">{{ project.summary }}</p>
        <p class="impact">{{ project.impact }}</p>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '../stores/workspace'

const statuses = ['All', 'Live', 'In Build', 'Research']
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

  return projects.value.filter((project) => project.status === activeStatus.value)
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

.meta {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--brand-teal);
}

h2 {
  margin-top: 0.6rem;
  font-size: 1.3rem;
}

.detail {
  margin-top: 0.45rem;
  color: var(--ink-600);
}

.impact {
  margin-top: 0.6rem;
  font-weight: 650;
  color: var(--ink-800);
}
</style>
