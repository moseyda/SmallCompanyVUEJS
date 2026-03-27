<template>
  <div class="page-wrap">
    <section class="glass panel">
      <h1>Operational Insights</h1>
      <p class="lead">A quick pulse on product confidence, adoption, and service reliability.</p>
    </section>

    <section class="grid-two">
      <article class="glass panel">
        <h2 class="section-title">Signal Scores</h2>
        <div class="signal-list">
          <div class="signal-item" v-for="signal in insightSignals" :key="signal.label">
            <div class="signal-head">
              <h3>{{ signal.label }}</h3>
              <strong>{{ signal.value }}%</strong>
            </div>
            <div class="meter-track">
              <span class="meter-fill" :style="{ width: signal.value + '%' }"></span>
            </div>
            <p class="detail">{{ signal.detail }}</p>
          </div>
        </div>
      </article>

      <article class="glass panel">
        <h2 class="section-title">Action Queue</h2>
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
  border: 1px solid rgba(73, 99, 128, 0.24);
  background: rgba(255, 255, 255, 0.74);
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

.meter-track {
  margin-top: 0.55rem;
  width: 100%;
  height: 9px;
  border-radius: 999px;
  background: rgba(57, 82, 109, 0.2);
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
