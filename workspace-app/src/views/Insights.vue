<template>
  <div class="page-wrap">
    <section class="glass panel">
      <h1>Security & Code Quality Insights</h1>
      <p class="lead">Real-time metrics on code quality, security posture, and remediation progress.</p>
    </section>

    <section class="grid-two">
      <article class="glass panel">
        <h2 class="section-title">Quality Metrics</h2>
        <div class="signal-list">
          <div class="signal-item" v-for="signal in insightSignals" :key="signal.label">
            <div class="signal-head">
              <h3>{{ signal.label }}</h3>
              <strong :class="getSignalClass(signal)">{{ signal.value }}</strong>
            </div>
            <div v-if="isNumericSignal(signal)" class="meter-track">
              <span class="meter-fill" :style="{ width: extractNumericValue(signal) + '%' }"></span>
            </div>
            <p class="detail">{{ signal.detail }}</p>
          </div>
        </div>
      </article>

      <article class="glass panel">
        <h2 class="section-title">Security Actions</h2>
        <div class="card-list">
          <div class="card-item" v-for="action in actions" :key="action.title">
            <h3>{{ action.title }}</h3>
            <p class="detail">{{ action.detail }}</p>
            <p class="owner">Owner: {{ action.owner }}</p>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '../stores/workspace'

const workspaceStore = useWorkspaceStore()
const { insightSignals, actions } = storeToRefs(workspaceStore)

onMounted(() => {
  workspaceStore.fetchInsights()
})

const extractNumericValue = (signal) => {
  if (typeof signal.value === 'number') {
    return Math.min(signal.value, 100)
  }
  const match = signal.value.match(/\d+/)
  return match ? Math.min(parseInt(match[0]), 100) : 0
}

const isNumericSignal = (signal) => {
  return typeof signal.value === 'number' || /^\d+/.test(signal.value)
}

const getSignalClass = (signal) => {
  const value = extractNumericValue(signal)
  if (value >= 80) return 'signal-value good'
  if (value >= 60) return 'signal-value moderate'
  return 'signal-value warning'
}
</script>

<style scoped>
h1 {
  font-size: clamp(1.6rem, 3.4vw, 2.7rem);
  margin-bottom: 0.7rem;
}

.signal-list {
  display: grid;
  gap: 0.9rem;
}

.signal-item {
  border-radius: var(--radius-md);
  border: 1px solid var(--line-soft);
  background: var(--surface-soft);
  padding: 0.8rem;
}

.signal-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}

.signal-head h3 {
  font-size: 1rem;
}

.signal-value {
  font-weight: 700;
  font-size: 1.1rem;
}

.signal-value.good {
  color: #16a34a;
}

.signal-value.moderate {
  color: #d97706;
}

.signal-value.warning {
  color: #dc2626;
}

.meter-track {
  margin-top: 0.55rem;
  width: 100%;
  height: 9px;
  border-radius: 999px;
  background: var(--meter-track);
  overflow: hidden;
}

.meter-fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--brand-gold), var(--brand-teal));
}

.detail {
  margin-top: 0.5rem;
  color: var(--ink-600);
}

.owner {
  margin-top: 0.55rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--ink-800);
}
</style>
